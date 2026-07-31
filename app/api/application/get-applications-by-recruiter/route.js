


// import { NextResponse } from "next/server";
// import Application from "@/models/application";
// import { connect } from "@/lib/dbConfig";

// connect();

// export async function POST(request) {
//   try {
//     const { _id, page = 1, limit = 15 } = await request.json();

//     if (!_id) {
//       return NextResponse.json(
//         { error: "Recruiter _id is required" },
//         { status: 400 }
//       );
//     }

//     // Calculate pagination skip and limit
//     const skip = (page - 1) * limit;

//     // Find applications for the recruiter with pagination, populate candidate and job details, and sort by createdAt (descending)
//     const applications = await Application.find({ recruiter_id: _id })
//       .populate("candidate_id", "name _id")
//       .populate("job_id", "jobTitle jobType address jobStatus")
//       .skip(skip) // Skip the number of items for pagination
//       .limit(limit) // Limit to the number of items per page
//       .sort({ createdAt: -1 }); // Sort by createdAt in descending order

//     // Get total count of applications for pagination
//     const totalCount = await Application.countDocuments({ recruiter_id: _id });

//     // Map the results to include the required fields
//     const response = applications.map((app) => ({
//       application_id: app._id,
//       applicationId: app.applicationId,
//       // candidate_name: app.candidate_id ? app.candidate_id.name : "Not Found",
//       candidate_id: app.candidate_id ? app.candidate_id._id : null,
//       status: app.status,
//       // createdAt: app.createdAt,
//       // updatedAt: app.updatedAt,
//       // updatedBy: app.updatedBy || null,
//       jobTitle: app.job_id ? app.job_id.jobTitle : null,
//       jobType: app.job_id ? app.job_id.jobType : null,
//       // address: app.job_id ? app.job_id.address : null,
//       job_id: app.job_id ? app.job_id._id : null,
//       jobStatus: app.job_id ? app.job_id.jobStatus : null,
//     }));
// console.log("response", response);
//     return NextResponse.json({ applications: response, totalCount }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }









// import { NextResponse } from "next/server";
// import Application from "@/models/application";
// import { connect } from "@/lib/dbConfig";

// connect();

// export async function POST(request) {
//   try {
//     const { _id, page = 1, limit = 15 } = await request.json();

//     if (!_id) {
//       return NextResponse.json(
//         { error: "Recruiter _id is required" },
//         { status: 400 }
//       );
//     }

//     // Calculate pagination skip and limit
//     const skip = (page - 1) * limit;

//     // Find applications for the recruiter with pagination, populate candidate and job details, and sort by createdAt (descending)
//     const applications = await Application.find({ recruiter_id: _id })
//       .populate("candidate_id", "name _id")
//       .populate("job_id", "jobTitle jobType address jobStatus")
//       .skip(skip) // Skip the number of items for pagination
//       .limit(limit) // Limit to the number of items per page
//       .sort({ createdAt: -1 }); // Sort by createdAt in descending order

//     // Get total count of applications for pagination
//     const totalCount = await Application.countDocuments({ recruiter_id: _id });

//     // Extract job IDs from the applications
//     const jobIds = [...new Set(applications.map(app => app.job_id._id))]; // Remove duplicates

//     // Get counts for each job in parallel (to avoid redundant counts)
//     const [submittedByYouCounts, fromSocialMediaCounts] = await Promise.all([
//       Application.aggregate([
//         { $match: { job_id: { $in: jobIds }, isFromSocialMedia: { $in: [false, null, undefined] } } },
//         { $group: { _id: "$job_id", count: { $sum: 1 } } }
//       ]),
//       Application.aggregate([
//         { $match: { job_id: { $in: jobIds }, isFromSocialMedia: true } },
//         { $group: { _id: "$job_id", count: { $sum: 1 } } }
//       ])
//     ]);

//     // Map the results to include the required fields
//     const response = applications.map(app => {
//       // Get the count for submittedByYou and fromSocialMedia for the current job_id
//       const submittedByYouCount = submittedByYouCounts.find(item => item._id.toString() === app.job_id._id.toString())?.count || 0;
//       const fromSocialMediaCount = fromSocialMediaCounts.find(item => item._id.toString() === app.job_id._id.toString())?.count || 0;

//       return {
//         application_id: app._id,
//         applicationId: app.applicationId,
//         candidate_id: app.candidate_id ? app.candidate_id._id : null,
//         status: app.status,
//         jobTitle: app.job_id ? app.job_id.jobTitle : null,
//         jobType: app.job_id ? app.job_id.jobType : null,
//         job_id: app.job_id ? app.job_id._id : null,
//         jobStatus: app.job_id ? app.job_id.jobStatus : null,
//         submittedByYou: submittedByYouCount,
//         fromSocialMedia: fromSocialMediaCount,
//       };
//     });

//     return NextResponse.json({ applications: response, totalCount }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



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

    // Find applications for the recruiter
    const applications = await Application.find({ recruiter_id: _id })
      .populate("job_id", "jobTitle jobStatus") // Get jobTitle and jobStatus
      .sort({ createdAt: -1 }); // Sort by createdAt to get the latest applications first

    // Group applications by job_id
    const groupedApplications = applications.reduce((acc, app) => {
      // If job_id doesn't exist in the accumulator, create a new group
      if (!acc[app.job_id._id]) {
        acc[app.job_id._id] = {
          jobId: app.job_id._id,
          jobTitle: app.job_id.jobTitle,
          jobStatus: app.job_id.jobStatus,
          submittedByYouCount: 0,
          fromSocialMediaCount: 0,
        };
      }

      // Update counts for submittedByYou and fromSocialMedia
      if (app.isFromSocialMedia) {
        acc[app.job_id._id].fromSocialMediaCount += 1;
      } else {
        acc[app.job_id._id].submittedByYouCount += 1;
      }

      return acc;
    }, {});

    // Convert groupedApplications object to an array of grouped jobs
    const groupedResponse = Object.values(groupedApplications);

    // Calculate total number of groups (jobs)
    const totalCount = groupedResponse.length;

    // Apply pagination to the groupedResponse array
    const skip = (page - 1) * limit;
    const paginatedGroupedResponse = groupedResponse.slice(skip, skip + limit);

    return NextResponse.json({
      applications: paginatedGroupedResponse,
      totalCount,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
