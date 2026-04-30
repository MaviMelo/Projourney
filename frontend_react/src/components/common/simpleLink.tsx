// src/components/common/simpleLink.tsx
import { Link, LinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

// Estilos que você já tinha
const variantStyles = {
  primary: " buttonPrimary",
  outline: "buttonOutline",
  navLink: "buttonLink",
  navButton: "buttonNav",
};

// Props simples: todas as props de um Link + a 'variant'
interface Props extends LinkProps {
  variant?: keyof typeof variantStyles;
}

export default function SimpleLink({ className, children, variant = "primary", ...props }: Props) {
  return (
    <Link className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </Link>
  );
}
