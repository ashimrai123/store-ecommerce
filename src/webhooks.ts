import express from "express";
import { stripe } from "./lib/stripe";
import { WebhookRequest } from "./server";
import { getPayloadClient } from "./get-payload";
import { Product } from "./payload-types";
import Stripe from "stripe";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import { ReceiptEmailHtml } from "./components/emails/ReceiptEmail";

// const resend = new Resend(process.env.RESEND_API_KEY)

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: "eoswebsolutions@gmail.com",
    pass: process.env.GMAIL_APP_PASS,
  },
});

export const stripeWebhookHandler = async (
  req: express.Request,
  res: express.Response
) => {
  //Validate that this request actually comes from stripe
  //update the +isPaid value  of this order
  // send receipt email

  const webhookRequest = req as any as WebhookRequest;
  const body = webhookRequest.rawBody;
  const signature = req.headers["stripe-signature"] || "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    return res
      .status(400)
      .send(
        `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`
      );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    return res.status(400).send(`Webhook Error: No user present in metadata`);
  }

  if (event.type === "checkout.session.completed") {
    const payload = await getPayloadClient();

    const { docs: users } = await payload.find({
      collection: "users",
      where: {
        id: {
          equals: session.metadata.userId,
        },
      },
    });

    const [user] = users;

    if (!user) return res.status(404).json({ error: "No such user exists." });

    const { docs: orders } = await payload.find({
      collection: "orders",
      depth: 2,
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    const [order] = orders;

    if (!order) return res.status(404).json({ error: "No such order exists." });

    await payload.update({
      collection: "orders",
      data: {
        _isPaid: true,
      },
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    // Send receipt using nodemailer
    try {
      const mailOptions: any = {
        from: '"EOS Store" <eoswebsolutions@gmail.com>', // sender address
        to: user.email, // list of receivers
        subject: "Thanks for your order! This is your receipt.", // Subject line
        html: ReceiptEmailHtml({
          date: new Date(),
          email: user.email as string,
          orderId: session.metadata.orderId,
          products: order.products as Product[],
        }), // HTML body content
      };

      // Send mail
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
          return res
            .status(500)
            .json({ error: "Failed to send receipt email" });
        }
        console.log("Email sent: ", info.response);
        res.status(200).json({ message: "Receipt email sent successfully" });
      });
    } catch (error) {
      console.error("Error in sending email: ", error);
      res.status(500).json({ error: "Failed to send receipt email" });
    }
  } else {
    // Handle other event types if necessary
    res.status(200).send();
  }
};
