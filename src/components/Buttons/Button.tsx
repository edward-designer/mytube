import React, {
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
} from "react";
import Link from "next/link";
import { cx } from "@/utils/helpers";

type ButtonOrAnchorProps = ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

interface ButtonProps extends ButtonOrAnchorProps {
  variant?: "primary" | "secondary-gray" | "tertiary-gray";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  href?: string;
}

const Button = ({
  onClick,
  variant = "primary",
  size = "md",
  href,
  disabled,
  className = "",
  ...props
}: ButtonProps) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-2 py-1 text-sm",
    lg: "px-2.5 py-1.5 text-sm",
    xl: "px-3 py-2 text-sm",
    "2xl": "px-3.5 py-2.5 text-sm",
  };

  const variantClasses = {
    primary:
      "rounded-full bg-primary-600 text-white focus:ring-4 hover:bg-primary-700 shadow-sm focus:ring-primary-100 focus-visible:outline-4 focus-visible:outline-primary-100 focus-visible:outline-offset-4",
    "secondary-gray":
      "disabled:opacity-30 rounded-full bg-gray-100 text-gray-500 focus:ring-4 shadow-sm ring-1 ring-inset focus:ring-gray-100  focus-visible:outline-4 focus-visible:outline-gray-100 focus-visible:outline-offset-4 ring-gray-200 hover:text-gray-800 hover:bg-gray-50",
    "tertiary-gray":
      "rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 focus:bg-white hover:text-gray-800",
  };

  const buttonClasses = cx([
    className,
    sizeClasses[size],
    variantClasses[variant],
    disabled ? "opacity-50 cursor-not-allowed" : "",
  ]);

  const tagProps = {
    className: buttonClasses,
    onClick,
    disabled,
    ...props,
  };

  return href ? <Link href={href} {...tagProps} /> : <button {...tagProps} />;
};

export default Button;
