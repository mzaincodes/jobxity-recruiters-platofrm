import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConfig";
import Recruiter from "@/models/recruiter";
import bcrypt from "bcryptjs";

connect();

// Single mapping
const roleFieldPermissions = {
  0: ["role"],
  1: [
    "isVerified",
    "role",
    "profilePercentage",
    "sts",
    "remarks",
    "bankDetails",
  ],
  3: [
    "role",
    "name",
    "email",
    "phone",
    "description",
    "pic",
    "gender",
    "country",
    "educationLevel",
    "recruitingExperience",
    "address",
    "linkedinUrl",
  ],
  5: [
    "role",
    "name",
    "email",
    "phone",
    "description",
    "pic",
    "gender",
    "country",
    "educationLevel",
    "totalExperience",
    "address",
    "linkedinUrl",
  ],
  4: [
    "role",
    "currentCompanyName",
    "totalExperience",
    "currentSalary",
    "expectedSalary",
    "noticePeriod",
    "location",
  ],
  5: [
    "role",
    "currentCompanyName",
    "totalExperience",
    "currentSalary",
    "expectedSalary",
    "noticePeriod",
    "location",
    "cv",
  ],
};

export async function PUT(req) {
  console.log("wwwwww 0000", req.url); 
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Recruiter ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    console.log("wwwwww 1111", body)
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: "No update data provided." },
        { status: 400 }
      );
    }

    // Fetch user from DB
    const user = await Recruiter.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const userRole = user.role; // "1", "3", "4", etc.
    console.log("wwwwww 222", userRole);
    if (!roleFieldPermissions[userRole]) {
      return NextResponse.json(
        { success: false, message: "Unauthorized role." },
        { status: 403 }
      );
    }

    const allowedFields = roleFieldPermissions[userRole];
    const updateData = {};

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    // Special handling for password (only admins can update)
    if (body.password && userRole === "1") {
      // Only role "1" (admin) can update password
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(body.password, salt);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid fields to update for your role." },
        { status: 400 }
      );
    }

    const updatedRecruiter = await Recruiter.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(
      { success: true, data: updatedRecruiter },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating recruiter:", error);
    return NextResponse.json(
      { success: false, message: "Server error." },
      { status: 500 }
    );
  }
}
