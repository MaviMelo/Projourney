
// src/components/common/SimpleButton.tsx
import { cn } from "@/lib/utils";

const variantStyles = {
  primary: "buttonPrimary",
  outline: "buttonOutline",
  navButton: "buttonNav",
};

// Props simples: todas as props de um botão + a nova 'variant'
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
}

export default function SimpleButton({ className, children, variant = "primary", ...props }: Props) {
  return (
    <button className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </button>
  );
}
