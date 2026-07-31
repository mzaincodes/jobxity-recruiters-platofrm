import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connect } from "@/lib/dbConfig";
import Recruiter from "@/models/recruiter";

connect();

export async function POST(req) {
  // Validate authentication
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Parse request body
  let data;
  try {
    data = await req.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
  }

  const {
    _id,
    phone,
    gender,
    recruitingExperience,
    totalExperience,
    educationLevel,
    description,
    linkedinUrl,
  } = data;

  // Ensure _id is provided
  if (!_id) {
    return NextResponse.json({ error: "_id is required" }, { status: 400 });
  }

  try {
    // Find recruiter by _id
    const recruiter = await Recruiter.findById(_id);
    if (!recruiter) {
      return NextResponse.json(
        { error: "Recruiter not found" },
        { status: 404 }
      );
    }

    // Update fields if provided
    if (phone) recruiter.phone = phone;
    if (gender) recruiter.gender = gender;
    if (recruitingExperience)
      recruiter.recruitingExperience = recruitingExperience;
    if (totalExperience) recruiter.totalExperience = totalExperience;
    if (educationLevel) recruiter.educationLevel = educationLevel;
    if (description) recruiter.description = description;
    if (linkedinUrl) recruiter.linkedinUrl = linkedinUrl;
    recruiter.consentDate = Math.floor(Date.now() / 1000);

    if (token?.role === "5") {
      recruiter.profilePercentage = (recruiter.profilePercentage || 0) + 30;
    } else if (token?.role === "3") {
      recruiter.profilePercentage = (recruiter.profilePercentage || 0) + 40;
    }

    // Save changes
    await recruiter.save();

    return NextResponse.json(
      { recruiter, message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating recruiter:", error);
    return NextResponse.json(
      { error: "Error updating recruiter" },
      { status: 500 }
    );
  }
}
