import React from "react";

export default function HelpIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      stroke="url(#grad)"
      className={className}
    >
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#833AB4" />
          <stop offset="50%" stopColor="#FD1D1D" />
          <stop offset="100%" stopColor="#FCB045" />
        </linearGradient>
      </defs>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 9a2.25 2.25 0 114.5 0c0 1.5-2.25 2.25-2.25 3.75M12 16.5h.007v.007H12V16.5z"
      />
    </svg>
  );
}
