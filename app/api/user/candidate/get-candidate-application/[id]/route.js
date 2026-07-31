import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConfig";
import Application from "@/models/application";
import Candidate from "@/models/candidate";
import Recruiter from "@/models/recruiter";  // Import Recruiter model

connect();

export async function GET(req, { params }) {
  const { id } = params;  // This is the application _id

  try {
    console.log("sdfsgwagsdced")
    // Find the application by _id and populate the candidate and job details
    const application = await Application.findById(id)
      .populate("candidate_id") // Populate the full candidate details
      .populate("job_id", "jobTitle jobType address requiredExperience salary gender positions deadline skills createdAt industry currentCompanyName") // Populate the job details
      .populate({
        path: "candidate_id",  // Populate candidate
        populate: {
          path: "createdBy",  // Populate recruiter from candidate's createdBy field
          select: "name",  // Only select the name of the recruiter
        },
      });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Get the recruiter's name from the populated candidate's createdBy field
    const recruiterName = application.candidate_id?.createdBy?.name;

    // Return the response with both candidate details, recruiter name, and application details
    const response = {
      application,
      recruiterName,  // Add recruiter name to the response
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching application or candidate:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
