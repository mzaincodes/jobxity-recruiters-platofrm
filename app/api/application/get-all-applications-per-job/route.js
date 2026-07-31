import Application from "@/models/application";
import { connect } from "@/lib/dbConfig";
export const dynamic = 'force-dynamic';

connect();

export async function GET(request) {
  // Extract jobId from query parameters
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return new Response(JSON.stringify({ success: false, message: "Job ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Fetch applications for the provided jobId, populating candidate and job details
    const applications = await Application.find({ job_id: jobId })
      .populate("candidate_id") // Populate candidate details
      .populate("job_id") // Populate job details
      .exec();
    console.log("applications", applications);
    return new Response(JSON.stringify({ success: true, applications }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
