import { NextResponse } from "next/server";
import Application from "@/models/application";
import { connect } from "@/lib/dbConfig";

connect();

export async function POST(request) {

  try {
    const { recruiter_id, job_id } = await request.json();
    if (!recruiter_id || !job_id) {
      return NextResponse.json(
        { error: "Both recruiter_id and job_id are required" },
        { status: 400 }
      );
    }

    // Find applications for the recruiter and job, populate candidate and job details, and sort by createdAt (descending)
    const applications = await Application.find({ recruiter_id, job_id })
      .populate("candidate_id", "name _id")
      .populate("job_id", "jobTitle jobType address")
      .sort({ createdAt: -1 }); // Sort by createdAt in descending order

    // Map the results to include the required fields
    const response = applications.map((app) => ({
      application_id: app._id,
      applicationId: app.applicationId,
      candidate_name: app.candidate_id ? app.candidate_id.name : "Not Found",
      candidate_id: app.candidate_id ? app.candidate_id._id : null,
      status: app.status,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      updatedBy: app.updatedBy || null,
      jobTitle: app.job_id ? app.job_id.jobTitle : null,
      jobType: app.job_id ? app.job_id.jobType : null,
      address: app.job_id ? app.job_id.address : null,
      isFromSocialMedia: app.isFromSocialMedia || false,
    }));

    return NextResponse.json({ applications: response }, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
