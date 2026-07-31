"use client";
import Image from "next/image";
import React, { useState } from "react";
import { updateUserRole } from "@/lib/api";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // ✅ Import router

export default function SelectRole() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter(); // ✅ Initialize router

  const handleSelect = async (role) => {
    setSelectedRole(role);
    try {
      setLoading(true);

      const userId = session?.user?.id;
      const response = await updateUserRole(userId, role);
      console.log("Update successful:", response, session);

      // 🔄 Refresh the session manually
      await getSession();
      window.location.href = "/?roleSelected=true";

      // ✅ Then redirect
    //   window.location.href = "/";
    //   window.location.reload();
    //   router.refresh();
    //   router.push("/");
    } catch (error) {
      console.error("Error updating role:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div className="mb-4 text-primary fw-bold d-flex align-items-center justify-content-center">
        <h2 className="d-flex gap-3 align-items-center justify-content-center">
          Welcome to{" "}
          <span>
            <Image
              width={154}
              height={50}
              src="/images/jobxity.png"
              alt="brand"
            />
          </span>
        </h2>
      </div>

      <div
        className="card shadow p-4"
        style={{
          maxWidth: "400px",
          width: "100%",
          height: "auto",
          marginTop: "5vh",
        }}
      >
        <h2 className="text-center mb-4">Select Your Role</h2>

        <div className="d-grid gap-3">
          <button
            className={`btn ${
              selectedRole === "5" ? "btn-primary" : "btn-outline-primary"
            } d-flex align-items-center justify-content-center gap-2`}
            onClick={() => handleSelect("5")}
            disabled={loading}
          >
            <i className="bi bi-person-fill fs-4"></i> Candidate
          </button>

          <button
            className={`btn ${
              selectedRole === "3" ? "btn-primary" : "btn-outline-primary"
            } d-flex align-items-center justify-content-center gap-2`}
            onClick={() => handleSelect("3")}
            disabled={loading}
          >
            <i className="bi bi-briefcase-fill fs-4"></i> Recruiter
          </button>
        </div>
      </div>
    </div>
  );
}
