import { cn } from "@/lib/utils";

export default function Spinner({
  size = "sm",
  color = "white",
  className,
}: {
  size?: "xs" | "sm" | "md";
  color?: "white" | "emerald" | "red";
  className?: string;
}) {
  const sizeClass  = { xs: "h-3 w-3",  sm: "h-4 w-4",      md: "h-5 w-5" }[size];
  const colorClass = {
    white:   "border-white border-t-transparent",
    emerald: "border-emerald-400 border-t-transparent",
    red:     "border-red-400 border-t-transparent",
  }[color];
  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-2",
        sizeClass,
        colorClass,
        className
      )}
    />
  );
}
