import React from "react";

export default function ProfileIcon({ className }) {
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
        d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4.5 20.25a8.25 8.25 0 0115 0v.75H4.5v-.75z"/>
    </svg>
  );
}
