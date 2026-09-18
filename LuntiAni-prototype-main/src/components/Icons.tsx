import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function LeafIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M11 20A7 7 0 0 1 4 13V6a1 1 0 0 1 1-1h7a7 7 0 0 1 7 7 7 7 0 0 1-7 7Z" />
      <path d="M4 13c4-1 7-4 8-8" />
    </Base>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 11 12 3l9 8" />
      <path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10" />
    </Base>
  );
}

export function HistoryIcon(props: IconProps) {
  return (
    <Base {...props}>
      <line x1="4" y1="20" x2="4" y2="10" />
      <line x1="10" y1="20" x2="10" y2="4" />
      <line x1="16" y1="20" x2="16" y2="13" />
    </Base>
  );
}

export function CropIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 20V10" />
      <path d="M12 10C12 6 9 4 5 4c0 4 2 7 7 7Z" />
      <path d="M12 10c0-4 3-6 7-6 0 4-2 7-7 7Z" />
    </Base>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <Base {...props}>
      <line x1="4" y1="6" x2="20" y2="6" />
      <circle cx="9" cy="6" r="2" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="15" cy="12" r="2" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="7" cy="18" r="2" />
    </Base>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 6 2 7H4c.5-1 2-3 2-7Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </Base>
  );
}

export function ThermometerIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 14V5a2 2 0 1 0-4 0v9a4 4 0 1 0 4 0Z" />
    </Base>
  );
}

export function DropletIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z" />
    </Base>
  );
}

export function CloudRainIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 16a4 4 0 0 1 .5-7.96A5.5 5.5 0 0 1 18 10.5 3.5 3.5 0 0 1 17.5 16H7Z" />
      <line x1="9" y1="19" x2="9" y2="21" />
      <line x1="13" y1="19" x2="13" y2="21" />
      <line x1="17" y1="19" x2="17" y2="21" />
    </Base>
  );
}

export function WindIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M3 8h11a2.5 2.5 0 1 0-2.5-2.5" />
      <path d="M3 12h15a2.5 2.5 0 1 1-2.5 2.5" />
      <path d="M3 16h8" />
    </Base>
  );
}

export function AlertTriangleIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 4 2 20h20L12 4Z" />
      <line x1="12" y1="10" x2="12" y2="15" />
      <circle cx="12" cy="17.75" r="1" fill="currentColor" stroke="none" />
    </Base>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5 10.8 15 16 9" />
    </Base>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" />
      <line x1="15" y1="12" x2="21" y2="12" />
      <path d="M18 9l3 3-3 3" />
    </Base>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    </Base>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 6l6 6-6 6" />
    </Base>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M15 6l-6 6 6 6" />
    </Base>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 9l6 6 6-6" />
    </Base>
  );
}

export function MessageIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 5h16v11H8l-4 4V5Z" />
    </Base>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </Base>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </Base>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </Base>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 3h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 6.2 2 2 0 0 1 6 3Z" />
    </Base>
  );
}

export function DatabaseIcon(props: IconProps) {
  return (
    <Base {...props}>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v12a7 3 0 0 0 14 0V6" />
      <path d="M5 12a7 3 0 0 0 14 0" />
    </Base>
  );
}

export function BeakerIcon(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M9 3h6" />
      <path d="M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3" />
    </Base>
  );
}

export function XIcon(props: IconProps) {
  return (
    <Base {...props}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </Base>
  );
}
