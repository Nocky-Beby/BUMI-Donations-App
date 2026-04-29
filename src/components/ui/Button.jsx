import { Link } from "react-router-dom";

const styles = {
  primary:
    "bg-brand-red text-white hover:bg-brand-redDark focus:ring-brand-red/20 shadow-lg shadow-pink-200/60",
  secondary:
    "bg-white text-brand-red border border-brand-red hover:bg-brand-blush focus:ring-brand-red/20",
  soft:
    "bg-brand-greenSoft text-brand-green border border-green-100 hover:bg-green-100 focus:ring-green-200",
  warning:
    "bg-brand-gold text-white hover:brightness-95 focus:ring-orange-200",
};

export default function Button({
  children,
  to,
  disabled = false,
  variant = "primary",
  className = "",
  ...props
}) {
  const common =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4";
  const disabledClassName = disabled
    ? "cursor-not-allowed opacity-60 shadow-none pointer-events-none"
    : "";

  if (to) {
    if (disabled) {
      return (
        <span
          aria-disabled="true"
          className={`${common} ${styles[variant]} ${disabledClassName} ${className}`}
        >
          {children}
        </span>
      );
    }

    return (
      <Link to={to} className={`${common} ${styles[variant]} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      disabled={disabled}
      className={`${common} ${styles[variant]} ${disabledClassName} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
