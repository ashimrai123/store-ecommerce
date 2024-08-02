import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";
import ProductReel from "@/components/ProductReel";

const perks = [
  {
    name: "Instant Delivery",
    Icon: ArrowDownToLine,
    description:
      "Get your assets delivered to your email in seconds and download right away. ",
  },
  {
    name: "Guaranteed Delivery",
    Icon: CheckCircle,
    description:
      "Ever asset on our platform is verified by ur team to ensure our highest quality standards. Not happy? We offer a 30-day refund guarantee.",
  },
  {
    name: "For the Planet",
    Icon: Leaf,
    description:
      "We've pledged 1% of sales to the preservation and resoration of the natural environment. ",
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        {" "}
        <div className="py-20 mx-auto flex flex-col items-center text-center max-w-3xl">
          <h1 className="text-4xl sm:text-6xl tracking-tight text-gray-900 font-bold">
            Your marketplace for high-quality{" "}
            <span className="text-red-600">digital assets</span>.
          </h1>
          <p className="mt-6 max-w-prose text-muted-foreground text-lg">
            Welcome to EOS Store. Every asset on our platform is verified by our
            team to ensure our highest quality standards.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link href={"/products"} className={buttonVariants()}>
              Browse Trending
            </Link>
            <Button variant={"ghost"}>Our Quality Promise &rarr;</Button>
          </div>
        </div>
        <ProductReel
          query={{ sort: "desc", limit: 4 }}
          title={"Brand new"}
          href="/products"
        />
      </MaxWidthWrapper>
      <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-col-1 gap-y-12 sm:grid-col-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div
                key={perk.name}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center "
              >
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-red-100 text-red-900">
                    <perk.Icon />
                  </div>
                </div>
                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium text-gray-900">
                    {perk.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-3">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
