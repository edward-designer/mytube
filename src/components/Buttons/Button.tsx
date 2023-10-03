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
      "bg-primary-600 text-white focus:ring-4 hover:bg-primary-700 shadow-sm focus:ring-primary-100 focus-visible:outline-4 focus-visible:outline-primary-100 focus-visible:outline-offset-4",
    "secondary-gray":
      " bg-white text-gray-700 focus:ring-4 shadow-sm ring-1 ring-inset focus:ring-gray-100  focus-visible:outline-4 focus-visible:outline-gray-100 focus-visible:outline-offset-4 ring-gray-300 hover:text-gray-800 hover:bg-gray-50",
    "tertiary-gray":
      " hover:bg-gray-50 text-gray-600 focus:bg-white hover:text-gray-700",
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
