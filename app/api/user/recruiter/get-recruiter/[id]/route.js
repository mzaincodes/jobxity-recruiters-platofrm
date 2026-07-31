import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConfig";
import Recruiter from "@/models/recruiter";  // Import Recruiter model

connect();

export async function GET(req, { params }) {
  const { id } = params;  // This is the recruiter _id passed as a parameter

  try {
    // Find the recruiter by _id and populate any required fields if needed
    const recruiter = await Recruiter.findById(id);

    if (!recruiter) {
      return NextResponse.json(
        { error: "Recruiter not found" },
        { status: 404 }
      );
    }

    // Return the recruiter object as the response
    return NextResponse.json(recruiter, { status: 200 });
  } catch (error) {
    console.error("Error fetching recruiter:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
