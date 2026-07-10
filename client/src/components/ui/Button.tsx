import { type ButtonHTMLAttributes, type PropsWithChildren } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
  }
>;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#102f2f] text-[#fffaf0] shadow-sm shadow-[#102f2f]/20 hover:bg-[#174344]",
  secondary: "border border-[#ddc8a3] bg-[#fffaf0] text-[#17201b] hover:bg-[#f3e8d4]",
  ghost: "text-[#31423a] hover:bg-[#efe2cd]",
  danger: "bg-rose-700 text-white hover:bg-rose-800",
};

export const Button = ({ children, className = "", variant = "primary", type = "button", ...props }: ButtonProps) => (
  <button
    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
    type={type}
    {...props}
  >
    {children}
  </button>
);
