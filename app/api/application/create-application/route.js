// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import Application from "@/models/application";
// import Candidate from "@/models/candidate";
// import Recruiter from "@/models/recruiter";
// import Job from "@/models/job";
// import { connect } from "@/lib/dbConfig";

// connect();
// export async function POST(req) {
//   try {
//     const { recruiter_id, candidate_id, job_id , cvLink} = await req.json();

//     if (
//       !mongoose.Types.ObjectId.isValid(recruiter_id) ||
//       !mongoose.Types.ObjectId.isValid(candidate_id) ||
//       !mongoose.Types.ObjectId.isValid(job_id)
//     ) {
//       return NextResponse.json(
//         { error: "Something went wrong, please reload and apply again." },
//         { status: 400 }
//       );
//     }

//     // Check if the recruiter, candidate, and job exist
//     const recruiter = await Recruiter.findById(recruiter_id);
//     if (!recruiter) {
//       return NextResponse.json(
//         { error: "Invalid recruiter." },
//         { status: 404 }
//       );
//     }

//     const candidate = await Candidate.findById(candidate_id);
//     if (!candidate) {
//       return NextResponse.json(
//         { error: "Invalid candidate." },
//         { status: 404 }
//       );
//     }

//     const job = await Job.findById(job_id);
//     if (!job) {
//       return NextResponse.json({ error: "Invalid job." }, { status: 404 });
//     }
//     if (!cvLink) {
//       return NextResponse.json({ error: "CV Link is required" }, { status: 404 });
//     }

//     // Create a new application
//     const newApplication = new Application({
//       recruiter_id,
//       candidate_id,
//       job_id,
//       cvLink
//     });

//     await newApplication.save();

//     return NextResponse.json(
//       {
//         message: "Application submitted successfully!",
//         application: newApplication,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating application:", error);
//     return NextResponse.json(
//       { error: "Something went wrong, please try again." },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Application from "@/models/application";
import Recruiter from "@/models/recruiter";
import Job from "@/models/job";
import { connect } from "@/lib/dbConfig";

connect();

export async function POST(req) {
  try {
    const { recruiter_id, candidate_id, job_id, cvLink } = await req.json();

    if (
      !mongoose.Types.ObjectId.isValid(recruiter_id) ||
      !mongoose.Types.ObjectId.isValid(candidate_id) ||
      !mongoose.Types.ObjectId.isValid(job_id)
    ) {
      return NextResponse.json(
        { error: "Something went wrong, please reload and apply again." },
        { status: 400 }
      );
    }

    // Check if the recruiter exists
    const recruiter = await Recruiter.findById(recruiter_id);
    if (!recruiter) {
      return NextResponse.json(
        { error: "Invalid recruiter." },
        { status: 404 }
      );
    }

    // Check if the candidate exists (as a recruiter with role "5")
    const candidate = await Recruiter.findOne({ _id: candidate_id, role: "5" });
    if (!candidate) {
      return NextResponse.json(
        { error: "Invalid candidate." },
        { status: 404 }
      );
    }

    // Check if the job exists
    const job = await Job.findById(job_id);
    if (!job) {
      return NextResponse.json({ error: "Invalid job." }, { status: 404 });
    }

    if (!cvLink) {
      return NextResponse.json({ error: "CV Link is required" }, { status: 400 });
    }

    // Create a new application
    const newApplication = new Application({
      recruiter_id,
      candidate_id,
      job_id,
      cvLink,
    });

    await newApplication.save();

    return NextResponse.json(
      {
        message: "Application submitted successfully!",
        application: newApplication,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { error: "Something went wrong, please try again." },
      { status: 500 }
    );
  }
}
