// import { NextResponse } from "next/server";
// import { connect } from "@/lib/dbConfig";
// import Application from "@/models/application";
// import Candidate from "@/models/candidate";
// import Recruiter from "@/models/recruiter";  // Import Recruiter model

// connect();

// export async function GET(req, { params }) {
//   const { id } = params;  // This is the application _id

//   try {
//     console.log("sdfsgwagsdced")
//     // Find the application by _id and populate the candidate and job details
//     const application = await Application.findById(id)
//       .populate("candidate_id") // Populate the full candidate details
//       .populate("job_id", "jobTitle jobType address requiredExperience salary gender positions deadline skills createdAt industry currentCompanyName") // Populate the job details
//       .populate({
//         path: "candidate_id",  // Populate candidate
//         populate: {
//           path: "createdBy",  // Populate recruiter from candidate's createdBy field
//           select: "name",  // Only select the name of the recruiter
//         },
//       });

//     if (!application) {
//       return NextResponse.json(
//         { error: "Application not found" },
//         { status: 404 }
//       );
//     }

//     // Get the recruiter's name from the populated candidate's createdBy field
//     const recruiterName = application.candidate_id?.createdBy?.name;

//     // Return the response with both candidate details, recruiter name, and application details
//     const response = {
//       application,
//       recruiterName,  // Add recruiter name to the response
//     };

//     return NextResponse.json(response, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching application or candidate:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConfig";
import Recruiter from "@/models/recruiter"; // Import Recruiter model

connect();

export async function GET(req, { params }) {
  const { id } = params;  // The candidate _id from params

  try {
    // Step 1: Find the candidate by ID
    const candidate = await Recruiter.findById(id).lean();  // Using lean() for better performance

    if (!candidate) {
      return NextResponse.json(
        { error: "candidate not found" },
        { status: 404 }
      );
    }

    // Step 2: Manually find the 'createdBy' field (assuming it's a reference to another candidate)
    if (candidate.createdBy) {
      const createdBy = await Recruiter.findById(candidate.createdBy).select("name _id");
      candidate.createdBy = createdBy || { name: "Unknown", _id: null }; // Handle case where createdBy is not found
    }

    // Step 3: Return the complete candidate object, including manually fetched createdBy field
    const response = {
      candidate,  // Return the entire candidate object, including the manually populated 'createdBy'
    };
console.log("seferg", candidate)
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
