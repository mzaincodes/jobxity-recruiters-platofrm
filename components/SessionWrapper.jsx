"use client";

import { Suspense } from "react";
import { JobProvider } from "@/app/context/JobContext";

export default function SessionWrapper({ children }) {
  return (
    <Suspense fallback={<Loader />}>
      <JobProvider>
        {children}
      </JobProvider>
    </Suspense>
  );
}

// Custom full-screen loader component
const Loader = () => {
  return (
    <div style={loaderContainerStyle}>
      <div style={spinnerStyle}></div>
      <p style={{ marginTop: "16px", color: "#555" }}>Loading...</p>
    </div>
  );
};

// Inline styles
const loaderContainerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  backgroundColor: "#f9f9f9",
  zIndex: 1000,
};

const spinnerStyle = {
  width: "50px",
  height: "50px",
  border: "6px solid #ccc",
  borderTop: "6px solid #007bff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

// Add global CSS animation for spin (you can add this in your global CSS or a layout file)
/* 
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
*/

