"use client";
import { PRODUCT_CATEGORIES } from "@/config";
import NavItem from "./NavItem";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

const NavItems = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };

    document.addEventListener("keydown", handler);
  }, []);

  const isAnyOpen = activeIndex != null;
  const navRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(navRef, () => setActiveIndex(null));

  return (
    <>
      <div className="flex items-center h-full">
        {PRODUCT_CATEGORIES.map((category, i) => {
          const handleOpen = () => {
            if (activeIndex === i) {
              setActiveIndex(null);
            } else {
              setActiveIndex(i);
            }
          };
          const isOpen = activeIndex === i;

          return (
            <>
              <div className="flex gap-4 " ref={navRef}>
                <NavItem
                  category={category}
                  handleOpen={handleOpen}
                  isAnyOpen={isAnyOpen}
                  isOpen={isOpen}
                  key={category.value}
                />
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default NavItems;

// "use client";

// import { PRODUCT_CATEGORIES } from "@/config";
// import { useState } from "react";
// import NavItem from "./NavItem";

// const NavItems = () => {
//   const [activeIndex, setActiveIndex] = useState<null | number>(null);

//   const isAnyOpen = activeIndex != null;
//   return (
//     <div className="h-full flex gap-4">
//       {PRODUCT_CATEGORIES.map((category, i) => {
//         const handleOpen = () => {
//           if (activeIndex === i) {
//             setActiveIndex(null);
//           } else {
//             setActiveIndex(i);
//           }
//         };

//         const isOpen = i === activeIndex;

//         return (
//           <NavItem
//             category={category}
//             handleOpen={handleOpen}
//             isAnyOpen={isAnyOpen}
//             isOpen={isOpen}
//             key={category.value}
//           />
//         );
//       })}
//     </div>
//   );
// };

// export default NavItems;
