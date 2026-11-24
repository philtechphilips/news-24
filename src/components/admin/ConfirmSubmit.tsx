"use client";

import { useFormStatus } from "react-dom";

/** Submit button that asks for confirmation first, e.g. for deletes. */
export default function ConfirmSubmit({
  message,
  label,
  className,
  children,
}: {
  message: string;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      aria-label={label}
      title={label}
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={className}
    >
      {children}
    </button>
  );
}
