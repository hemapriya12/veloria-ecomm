import { cn } from "@/lib/utils";

export default function Spinner({
  size = "sm",
  className,
}: {
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  const sizeClass = { xs: "h-3 w-3", sm: "h-4 w-4", md: "h-5 w-5" }[size];
  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-white border-t-transparent",
        sizeClass,
        className
      )}
    />
  );
}
