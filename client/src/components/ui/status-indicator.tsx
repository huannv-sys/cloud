import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "online" | "offline";
  className?: string;
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  return (
    <span 
      className={cn(
        "inline-flex items-center justify-center h-6 w-6 rounded-full",
        status === "online" ? "bg-success-100" : "bg-danger-100",
        className
      )}
    >
      <span 
        className={cn(
          "h-3 w-3 rounded-full",
          status === "online" ? "bg-success-500" : "bg-danger-500"
        )}
      />
    </span>
  );
}
