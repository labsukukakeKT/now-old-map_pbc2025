"use client";
import React from "react";

type Props = {
  disabled?: boolean;
  onCreate: () => void;
  children?: React.ReactNode;
};

export default function CreatePlaceButton({ disabled, onCreate, children }: Props) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onCreate();
      }}
      disabled={!!disabled}
      style={{
        background: disabled
          ? "linear-gradient(180deg,#cbd7ff 0%,#b5cfff 100%)"
          : "linear-gradient(180deg,#0b5fff 0%,#0061e0 100%)",
        color: "#fff",
        border: 0,
        padding: "9px 14px",
        borderRadius: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 600,
        boxShadow: disabled ? "none" : "0 6px 18px rgba(11,95,255,0.14)",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {children ?? "Create place here"}
    </button>
  );
}
