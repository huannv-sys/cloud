import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats bytes to human-readable sizes (KB, MB, GB)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string): string {
  if (!date) return "N/A";
  
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formats an uptime value (in seconds) to a readable string
 */
export function formatUptime(seconds: number): string {
  if (!seconds) return "N/A";
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Returns a color class based on a status value
 */
export function getStatusColor(status: "online" | "offline" | "warning" | "unknown"): string {
  switch (status) {
    case "online":
      return "text-success-500";
    case "offline":
      return "text-danger-500";
    case "warning":
      return "text-warning-500";
    default:
      return "text-gray-500";
  }
}

/**
 * Truncates text to a specific length
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Generates a random connection string for a new router
 */
export function generateConnectionString(): string {
  const vpnServer = "vpn1.remotewinbox.com";
  const randomPort = Math.floor(20000 + Math.random() * 40000);
  return `${vpnServer}:${randomPort}`;
}

/**
 * Determines firmware status based on version
 */
export function getFirmwareStatus(version: string): "up-to-date" | "update-available" | "rc" | "outdated" {
  if (!version) return "outdated";
  
  if (version.includes("rc")) return "rc";
  
  // Example logic - would need to be updated with actual version logic
  const versionNumber = parseFloat(version.split(".").slice(0, 2).join("."));
  
  if (versionNumber >= 7.1) return "up-to-date";
  if (versionNumber >= 6.4) return "update-available";
  return "outdated";
}

/**
 * Returns a color for firmware status
 */
export function getFirmwareStatusColor(status: "up-to-date" | "update-available" | "rc" | "outdated"): string {
  switch (status) {
    case "up-to-date":
      return "text-success-500";
    case "update-available":
      return "text-warning-500";
    case "rc":
      return "text-primary-500";
    case "outdated":
      return "text-danger-500";
    default:
      return "text-gray-500";
  }
}

/**
 * Converts a tag name to a color
 */
export function getTagColor(tagName: string): string {
  // Simple hash function to get a consistent color for the same tag name
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // List of tailwind color classes
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-red-100 text-red-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
  ];
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Delay helper for async operations (useful for mocking API calls)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
