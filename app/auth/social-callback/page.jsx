// "use client";
// import { useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// const SocialCallbackPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const role = searchParams.get("role");
//     if (role) {
//       localStorage.setItem("signupRole", role); // Save role in localStorage
//     }
//     router.push("/"); // or redirect to dashboard etc
//   }, []);

//   return (
//     <div>Loading...</div>
//   );
// };

// export default SocialCallbackPage;

// app/auth/social-callback/page.tsx or similar

"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loader from "@/components/my-components/Loader";

function SocialCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const role = searchParams.get("role");
    if (role) {
      localStorage.setItem("signupRole", role);
    }
    router.push("/");
  }, []);

  return (
    <>
      <Loader />
    </>
  );
}

export default function SocialCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SocialCallbackInner />
    </Suspense>
  );
}
