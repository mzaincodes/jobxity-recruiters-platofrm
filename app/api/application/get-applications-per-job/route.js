import Application from "@/models/application";
import Recruiter from "@/models/recruiter";
import { connect } from "@/lib/dbConfig";

connect();

export async function POST(request) {
  try {
    const { job_id } = await request.json();
    
    if (!job_id) {
      return new Response("Job ID is required", { status: 400 });
    }

    // Find all applications for the given job_id
    const applications = await Application.find({ job_id }).populate("recruiter_id", "name createdAt _id");

    // Group applications by recruiter_id and count them
    const recruiterApplicationCount = {};

    applications.forEach((application) => {
      const recruiterId = application.recruiter_id._id.toString(); // Using .toString() to ensure proper comparison

      if (recruiterApplicationCount[recruiterId]) {
        recruiterApplicationCount[recruiterId].count += 1;
      } else {
        recruiterApplicationCount[recruiterId] = {
          recruiterId: application.recruiter_id._id,
          name: application.recruiter_id.name,
          createdAt: application.recruiter_id.createdAt,
          count: 1,
        };
      }
    });

    // Convert the recruiterApplicationCount object into an array
    const result = Object.values(recruiterApplicationCount);

    // Return the result array as a response
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error fetching applications and recruiters:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
