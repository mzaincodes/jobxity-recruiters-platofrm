import { NextResponse } from "next/server";
import Application from "@/models/application";
import { connect } from "@/lib/dbConfig";

connect();

export async function POST(request) {
  try {
    const { _id, page = 1, limit = 15 } = await request.json();

    if (!_id) {
      return NextResponse.json(
        { error: "Recruiter _id is required" },
        { status: 400 }
      );
    }

    // Calculate pagination skip and limit
    const skip = (page - 1) * limit;

    // Find applications for the recruiter with pagination, status filter, populate candidate and job details, and sort by createdAt (descending)
    const applications = await Application.find({ 
      recruiter_id: _id, 
      status: "5"  // Filter applications with status '5'
    })
      .populate("candidate_id", "name _id")
      .populate("job_id", "jobTitle jobType address")
      .skip(skip) // Skip the number of items for pagination
      .limit(limit) // Limit to the number of items per page
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order

    // Get total count of applications with status "5" for pagination
    const totalCount = await Application.countDocuments({ 
      recruiter_id: _id, 
      status: "5"  // Count only those with status '5'
    });

    // Map the results to include the required fields
    const response = applications.map((app) => ({
      application_id: app._id,
      candidate_name: app.candidate_id ? app.candidate_id.name : "Not Found",
      candidate_id: app.candidate_id ? app.candidate_id._id : null,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      updatedBy: app.updatedBy || null,
      jobTitle: app.job_id ? app.job_id.jobTitle : null,
      jobType: app.job_id ? app.job_id.jobType : null,
      address: app.job_id ? app.job_id.address : null,
    }));

    return NextResponse.json({ applications: response, totalCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
