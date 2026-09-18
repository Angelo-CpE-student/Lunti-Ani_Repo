import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "./Icons";

export function PrimaryButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...rest}
      className={`w-full rounded-xl bg-field px-6 py-4 text-lg font-semibold text-white transition-transform active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      {...rest}
      className={`w-full rounded-xl border-2 border-field px-6 py-4 text-lg font-semibold text-field transition-transform active:scale-[0.98] disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

export function BackButton({ to }: { to?: string }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      aria-label="Go back"
      className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-black/5"
    >
      <ChevronLeftIcon size={22} />
    </button>
  );
}

export function ScreenHeader({
  title,
  onBack,
  backTo,
}: {
  title: string;
  onBack?: boolean;
  backTo?: string;
}) {
  return (
    <header className="flex items-center gap-2 px-5 pt-6 pb-2 md:px-8">
      {onBack && <BackButton to={backTo} />}
      <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-parchment border border-line p-5 ${className}`}>
      {children}
    </div>
  );
}
