import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// Router icons for different MikroTik models
export const RouterIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="8" width="16" height="12" rx="2" />
    <path d="M6 12h.01M8 12h.01M10 12h.01" />
    <path d="M2 14h2M20 14h2" />
    <path d="M3 9v6M21 9v6" />
  </svg>
);

export const WifiRouterIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path d="M12 4c4.418 0 8 1.791 8 4v2H4V8c0-2.209 3.582-4 8-4z" />
    <path d="M6 14h.01M8 14h.01M10 14h.01" />
    <path d="M8 18c.5-.5 2-.5 2.5 0 .5.5 2 .5 2.5 0 .5-.5 2-.5 2.5 0" />
  </svg>
);

export const MeshRouterIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="7" width="16" height="10" rx="2" />
    <path d="M7 11h.01M11 11h.01M15 11h.01" />
    <path d="M2 13v-2M22 13v-2" />
    <path d="M12 19v2M8 21h8" />
    <path d="M16 4c0-1.1-.9-2-2-2s-2 .9-2 2M12 4v3" />
  </svg>
);

export const SwitchIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01" />
    <path d="M6 14h.01M10 14h.01M14 14h.01M18 14h.01" />
  </svg>
);

export const LTERouterIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="4" y="6" width="16" height="12" rx="2" />
    <path d="M7 10h.01M11 10h.01M15 10h.01" />
    <path d="M19 2c2 0 3 1 3 3M2 19c0 2 1 3 3 3M19 22c2 0 3-1 3-3M2 5c0-2 1-3 3-3" />
    <path d="M5 14h3M12 14h7" />
  </svg>
);

// ICTECH brand logo
export const ICTECHLogo: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20M2 12h20M5.94 5.94l12.12 12.12M5.94 18.06l12.12-12.12" />
  </svg>
);

// Network icons
export const NetworkIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="16" y="16" width="6" height="6" rx="1" />
    <rect x="2" y="16" width="6" height="6" rx="1" />
    <rect x="9" y="2" width="6" height="6" rx="1" />
    <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 8v4" />
  </svg>
);

export const TopologyIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="5" r="3" />
    <circle cx="5" cy="19" r="3" />
    <circle cx="19" cy="19" r="3" />
    <path d="M12 8v4M5 16l-2-4M19 16l2-4M5 16l7-4M19 16l-7-4" />
  </svg>
);

export const ServerIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <path d="M6 6h.01M6 18h.01" />
  </svg>
);

// Feature icons
export const BackupIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M7 5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v0a7 7 0 0 1-10 0v0Z" />
    <path d="M12 12V8" />
  </svg>
);

export const FirmwareIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12.5 2H10a5 5 0 0 0-5 5v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7l-5.5-5Z" />
    <path d="M14 2v4a1 1 0 0 0 1 1h4" />
    <path d="m10 14 2 2 4-4" />
  </svg>
);

export const CommandIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m4 6 6 6-6 6" />
    <path d="M20 12H10" />
  </svg>
);

export const SecurityIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// Status icons
export const OnlineIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export const OfflineIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M5 12h14" />
  </svg>
);

export const WarningIcon: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

// MikroTik Logo (simplified version)
export const MikroTikLogo: React.FC<IconProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 2L2 7v10l10 5 10-5V7L12 2zM12 4.236L19.382 8 12 11.764 4.618 8 12 4.236zM4 9.764l7 3.527v5.945L4 15.709V9.764zm16 0v5.945l-7 3.527v-5.945l7-3.527z"
      fill="currentColor"
    />
  </svg>
);
