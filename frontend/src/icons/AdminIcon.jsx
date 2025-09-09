import React from "react";

export default function AdminIcon({ className }) {
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
        d="M11.25 4.5l.75-1.5.75 1.5a7.5 7.5 0 013 0l.75-1.5.75 1.5a7.5 7.5 0 012.598 1.902l1.5-.75-.75 1.5a7.5 7.5 0 010 3l1.5.75-1.5.75a7.5 7.5 0 01-1.902 2.598l.75 1.5-1.5-.75a7.5 7.5 0 01-3 0l-.75 1.5-.75-1.5a7.5 7.5 0 01-2.598-1.902l-1.5.75.75-1.5a7.5 7.5 0 010-3l-1.5-.75 1.5-.75A7.5 7.5 0 0111.25 4.5z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
