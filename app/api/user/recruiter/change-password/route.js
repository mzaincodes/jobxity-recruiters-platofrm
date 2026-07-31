import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConfig";
import Recruiter from "@/models/recruiter";
import bcrypt from "bcryptjs";

connect();

export async function POST(req) {
  try {
    const { id, currentPassword, newPassword, confirmNewPassword } = await req.json();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return NextResponse.json({ error: "All fields (currentPassword, newPassword, confirmNewPassword) are required" }, { status: 400 });
    }

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ error: "New password and confirm password do not match" }, { status: 400 });
    }

    // Get recruiter from the session or request (this depends on how you manage authentication, e.g., via JWT or session)
    const recruiter = await Recruiter.findById(id); // Assuming `userId` is available via session or JWT

    if (recruiter?.source === "G" || recruiter?.source === "L") {
      return NextResponse.json({ error: "Cannot change password of a social logged in account" }, { status: 404 });
    }

    if (!recruiter) {
      return NextResponse.json({ error: "Recruiter not found" }, { status: 404 });
    }

    // Check if current password is correct
    const isPasswordValid = await bcrypt.compare(currentPassword, recruiter.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid current password" }, { status: 400 });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the recruiter's password
    recruiter.password = hashedNewPassword;
    await recruiter.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
