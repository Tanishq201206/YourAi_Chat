import React from "react";

export default function ChatIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" 
         viewBox="0 0 24 24" fill="none" 
         stroke="url(#sidebarGradient)" strokeWidth="1.5" 
         className={className}>
      <defs>
        <linearGradient id="sidebarGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#833AB4" />
          <stop offset="50%" stopColor="#FD1D1D" />
          <stop offset="100%" stopColor="#FCB045" />
        </linearGradient>
      </defs>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M8 10h8M8 14h5m6-9H5a2 2 0 00-2 2v9.5A1.5 1.5 0 004.5 18H7l4 3 4-3h2.5a1.5 1.5 0 001.5-1.5V7a2 2 0 00-2-2z"/>
    </svg>
  );
}
