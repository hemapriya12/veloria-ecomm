import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";
import Spinner from "./Spinner";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  fullWidth?: boolean;
}

export default function PrimaryButton({
  loading,
  fullWidth,
  children,
  className,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl py-2.5 px-5",
        "text-sm font-semibold text-white transition-all",
        "disabled:opacity-60",
        fullWidth && "w-full",
        className
      )}
      style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}
