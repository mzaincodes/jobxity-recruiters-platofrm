// "use client"; // Required for useRouter in App Router

// import { useSearchParams } from "next/navigation";

// export default function AuthErrorPage() {
//   const searchParams = useSearchParams();
//   const error = searchParams.get("error");
//   const source = searchParams.get("source");

//   const sourceMessages = {
//     G: "Google Account",
//     L: "LinkedIn Account",
//   };

//   const errorMessages = {
//     EmailAlreadyRegistered: `This email is already registered with a ${sourceMessages[source] || "Recruiter account"}.`,
//     InvalidProvider: `This email is registered with a different provider. Please sign in using your ${sourceMessages[source] || "original"}.`,
//     UnexpectedError: "Something went wrong. Please try again later.",
//   };

//   return (
//     <div
//       style={{
//         textAlign: "center",
//         padding: "50px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         height: "100vh",
//         width: "100vw",
//         flexDirection: "column",
//       }}
//     >
//       <h1 className="text-danger">Authentication Error!</h1>
//       <p className="text-danger">{errorMessages[error] || "An unknown error occurred."}</p>

//       <a
//         href="/"
//         className="theme-btn btn-style-one mt-5"
//         style={{ paddingInline: "60px" }}
//       >
//         Go Back
//       </a>
//     </div>
//   );
// }



"use client"; // Required for useSearchParams in App Router

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const source = searchParams.get("source");

  const sourceMessages = {
    G: "Google Account",
    L: "LinkedIn Account",
  };

  const errorMessages = {
    EmailAlreadyRegistered: `This email is already registered with a ${sourceMessages[source] || "Recruiter account"}.`,
    InvalidProvider: `This email is registered with a different provider. Please sign in using your ${sourceMessages[source] || "original"}.`,
    UnexpectedError: "Something went wrong. Please try again later.",
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        flexDirection: "column",
      }}
    >
      <h1 className="text-danger">Authentication Error!</h1>
      <p className="text-danger">{errorMessages[error] || "An unknown error occurred."}</p>

      <a
        href="/"
        className="theme-btn btn-style-one mt-5"
        style={{ paddingInline: "60px" }}
      >
        Go Back
      </a>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
