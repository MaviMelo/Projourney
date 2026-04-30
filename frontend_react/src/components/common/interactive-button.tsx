

import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import type { InteractiveButtonProps } from "../../types";

export default function InteractiveButton({
  href,
  children,
  variant = "primary",
  className,
  as = "button", // Default to rendering an anchor tag

}: InteractiveButtonProps & { as?: "button" | "link"; type?: string }) {
  const variantStyles = {
    primary: "buttonPrimary",
    outline: "buttonOutline",
    navLink: "buttonLink",
    navButton: "buttonNav",
  };

  const commonClasses = "relative inline-block duration-300";

  
  if (as === "link") {
    return (
      <Link
      to={href}
      className={cn(commonClasses, variantStyles[variant], className)}
      >
        {children}
        </Link>
      );
    }
    return (
      <button
      className={cn(commonClasses, variantStyles[variant], className)}
      >
          {children}
        </button>
      );
    }
