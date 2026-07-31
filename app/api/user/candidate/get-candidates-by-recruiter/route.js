import { NextResponse } from "next/server";
import Application from "@/models/application";
import { connect } from "@/lib/dbConfig";

connect();

export async function POST(request) {
  try {
    const { recruiterId, page = 1, limit = 15, status = "5" } = await request.json();

    if (!recruiterId) {
      return NextResponse.json(
        { error: "Recruiter _id is required" },
        { status: 400 }
      );
    }

    // Calculate pagination skip and limit
    const skip = (page - 1) * limit;

    // Step 1: Find all applications for the recruiter where status is "5"
    const applications = await Application.find({ recruiter_id: recruiterId, status: status })
      .populate("candidate_id", "name _id status location") // Populate candidate details
      .populate("job_id", "jobTitle jobType address") // Populate job details
      .skip(skip) // Pagination skip
      .limit(limit) // Pagination limit
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order

    // Return the filtered applications with status "5" and populated candidate_id
    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
