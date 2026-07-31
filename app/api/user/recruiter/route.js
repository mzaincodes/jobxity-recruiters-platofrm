import { connect } from "@/lib/dbConfig";
import Recruiter from "@/models/recruiter";
import { NextResponse } from "next/server";

connect(); // Ensure database connection
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Decode the email in case it's URL-encoded
  const decodedEmail = decodeURIComponent(email);

  try {
    const recruiter = await Recruiter.findOne({ email: decodedEmail }).lean();

    if (!recruiter) {
      return NextResponse.json(
        { error: "Recruiter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(recruiter, { status: 200 });
  } catch (error) {
    console.error("Error fetching recruiter:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
