// import Application from "@/models/application";
// import { connect } from "@/lib/dbConfig";

// export async function GET(request) {
//   await connect();

//   try {
//     const { searchParams } = new URL(request.url);
//     const candidate_id = searchParams.get("candidate_id");

//     if (!candidate_id) {
//       return new Response(
//         JSON.stringify({ error: "candidate_id is required" }),
//         { status: 400 }
//       );
//     }

//     // Query applications with candidate_id and populate job_id fields
//     const applications = await Application.find({ candidate_id })
//       .select("applicationId application_id status job_id")
//       .populate({
//         path: "job_id",
//         select: "jobTitle jobStatus",
//       })
//       .lean();

//     // Map results to desired output shape
//     const result = applications.map((app) => ({
//       applicationId: app.applicationId,
//       application_id: app.application_id,
//       status: app.status,
//       job_id: app.job_id._id,
//       jobTitle: app.job_id.jobTitle,
//       jobStatus: app.job_id.jobStatus,
//     }));

//     return new Response(JSON.stringify(result), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//     return new Response(
//       JSON.stringify({ error: "Internal Server Error" }),
//       { status: 500 }
//     );
//   }
// }

import Application from "@/models/application";
import { connect } from "@/lib/dbConfig";
export const dynamic = 'force-dynamic';

export async function GET(request) {
  await connect();

  try {
    const { searchParams } = new URL(request.url);

    const candidate_id = searchParams.get("candidate_id");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 15;
    console.log("gewtgte", candidate_id);
    if (!candidate_id) {
      return new Response(
        JSON.stringify({ error: "candidate_id is required" }),
        { status: 400 }
      );
    }

    // Count total applications for this candidate
    const totalCount = await Application.countDocuments({ candidate_id });

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch applications with pagination, populate job info
    const applications = await Application.find({ candidate_id })
      .select("applicationId updatedAt createdAt application_id status job_id")
      .populate({
        path: "job_id",
        select: "jobTitle jobStatus",
      })
      .sort({ createdAt: -1 }) // sort newest first
      .skip(skip)
      .limit(limit)
      .lean();
    console.log("gsegrtrtg", applications);
    // Format the response data
    const result = applications.map((app) => ({
      applicationId: app.applicationId,
      application_id: app.application_id,
      status: app.status,
      job_id: app.job_id._id,
      jobTitle: app.job_id.jobTitle,
      jobStatus: app.job_id.jobStatus,
      updatedAt: app.updatedAt,
      createdAt: app.createdAt,
    }));

    return new Response(JSON.stringify({ applications: result, totalCount }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
