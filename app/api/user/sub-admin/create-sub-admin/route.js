import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConfig";
import Recruiter from "@/models/recruiter";
import bcrypt from "bcryptjs";
import { sendMail } from "@/utils/mail";

connect();

async function sendCredentials(email, password) {
  const subject = "Sub Admin Account Credentials";
  const message = `Your account has been created.\n\nEmail: ${email}\nPassword: ${password}\n\nPlease login at https://recruiters.jobxity.com/`;
  await sendMail(email, subject, message);
}

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if the recruiter already exists
    const existingRecruiter = await Recruiter.findOne({ email });
    if (existingRecruiter) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new recruiter
    const newRecruiter = await Recruiter.create({
      name: name,
      role: "2",
      email: email,
      password: hashedPassword,
      isVerified: true,
      source: "M",
      pic:"https://img.freepik.com/premium-vector/user-profile-icon-flat-style-member-avatar-vector-illustration-isolated-background-human-permission-sign-business-concept_157943-15752.jpg?semt=ais_hybrid"
    });

    // Send credentials via email
    await sendCredentials(email, password);

    return NextResponse.json(
      {
        message: "Sub Admin Registered Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering Sub Admin:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
