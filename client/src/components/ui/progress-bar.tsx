import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  variant = "default",
  size = "md",
  className
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);
  
  const getColorClass = () => {
    switch (variant) {
      case "success":
        return "bg-success-500";
      case "warning":
        return "bg-warning-500";
      case "danger":
        return "bg-danger-500";
      default:
        return "bg-primary-500";
    }
  };
  
  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "h-1.5";
      case "lg":
        return "h-3";
      default:
        return "h-2";
    }
  };
  
  return (
    <div className={cn("flex items-center", className)}>
      {showLabel && (
        <span className="mr-2 text-sm">{percentage}%</span>
      )}
      <div className={cn("bg-gray-200 rounded-full overflow-hidden flex-1", getSizeClass())}>
        <div
          className={cn("rounded-full", getSizeClass(), getColorClass())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
