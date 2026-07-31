// import { NextResponse } from "next/server";
// import { connect } from "@/lib/dbConfig";
// import Job from "@/models/job";

// connect();
// // This route expects a URL parameter "id" (the Job's _id)
// export async function GET(req, { params }) {
//   const { id } = params;
//   const { searchParams } = new URL(req.url);
//   const myId = searchParams.get("myId"); // this gets the myId query param

//   try {
//     // Find the job by ID and populate the jobPostedBy field with _id and name only.
//     const job = await Job.findById(id)
//       .populate("jobPostedBy", "name _id")
//       .lean();

//     if (!job) {
//       return NextResponse.json({ error: "Job not found" }, { status: 404 });
//     }

//     // Now, job.jobPostedBy is an object with _id and name.
//     return NextResponse.json({ job }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching job:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }





// import { NextResponse } from "next/server";
// import { connect } from "@/lib/dbConfig";
// import Job from "@/models/job";
// import Application from "@/models/application";

// connect();

// export async function GET(req, { params }) {
//   const { id } = params;
//   const { searchParams } = new URL(req.url);
//   const myId = searchParams.get("myId"); // candidate_id to check application
//   try {
//     // Find the job by ID and populate jobPostedBy field
//     const job = await Job.findById(id)
//       .populate("jobPostedBy", "name _id")
//       .lean();

//     if (!job) {
//       return NextResponse.json({ error: "Job not found" }, { status: 404 });
//     }

//     // Check if the candidate has already applied to this job
//     let alreadyApplied = false;
//     if (myId) {
//       const application = await Application.findOne({
//         job_id: id,
//         candidate_id: myId,
//       }).lean();
//       alreadyApplied = !!application;
//     }

//     return NextResponse.json({ job, alreadyApplied }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching job:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConfig";
import Job from "@/models/job";
import Application from "@/models/application";

connect();

export async function GET(req, { params }) {
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const myId = searchParams.get("myId");

  try {
    // Find the job by ID and populate jobPostedBy field
    const job = await Job.findById(id)
      .populate("jobPostedBy", "name _id")
      .lean();

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    let alreadyApplied = false;

    // Ensure myId is a valid non-null, non-"null", non-"undefined" value
    const isValidCandidateId = myId && myId !== "null" && myId !== "undefined";

    if (isValidCandidateId) {
      const application = await Application.findOne({
        job_id: id,
        candidate_id: myId,
      }).lean();
      alreadyApplied = !!application;
    }

    return NextResponse.json({ job, alreadyApplied }, { status: 200 });
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
