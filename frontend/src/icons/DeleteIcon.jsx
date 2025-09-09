import React from "react";

export default function DeleteIcon({ className }) {
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
        d="M6 7.5h12M9.75 7.5V6a1.5 1.5 0 011.5-1.5h1.5A1.5 1.5 0 0114.25 6v1.5m-7.5 0v12a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5v-12"/>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6m4-6v6"/>
    </svg>
  );
}
