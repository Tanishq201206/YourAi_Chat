import React from "react";

export default function RenameIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24"
      strokeWidth="1.8" stroke="url(#grad)" className={className}>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#833AB4"/>
          <stop offset="50%" stopColor="#FD1D1D"/>
          <stop offset="100%" stopColor="#FCB045"/>
        </linearGradient>
      </defs>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M16.862 4.487l2.651 2.651-9.193 9.193-3.404.753.753-3.404 9.193-9.193zM19.488 7.113L16.862 4.487M14.25 6.75l3 3"/>
    </svg>
  );
}
