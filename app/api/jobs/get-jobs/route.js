// import { NextResponse } from "next/server";
// import Job from "@/models/job";
// import Application from "@/models/application";  // Import the Application model
// import { connect } from "@/lib/dbConfig";

// connect();

// export async function GET(req) {
//   try {
//     // Properly extract page and limit using .get()
//     const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
//     const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");

//     // Calculate the skip value based on page and limit
//     const skip = (page - 1) * limit;

//     // Get the jobs with pagination
//     const jobs = await Job.find({})
//       .skip(skip)  // Skip the jobs based on current page
//       .limit(limit)  // Limit the number of jobs returned per page
//       .sort({ createdAt: -1 });

//     // Map through each job and add the number of applications for that job
//     const jobsWithApplicationCount = await Promise.all(
//       jobs.map(async (job) => {
//         // Count applications for each job
//         const applicationCount = await Application.countDocuments({ job_id: job._id });

//         // Return the job object with the additional application count
//         return {
//           ...job.toObject(),
//           applicationCount,  // Add the count to each job object
//         };
//       })
//     );

//     // Get the total count of jobs to calculate total pages
//     const totalCount = await Job.countDocuments({});

//     // Return the jobs with application counts and totalPages
//     return NextResponse.json({
//       jobs: jobsWithApplicationCount,
//       totalPages: Math.ceil(totalCount / limit),  // Calculate total pages
//     });
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     return NextResponse.json({ error: "Error fetching jobs" }, { status: 500 });
//   }
// }



// import { NextResponse } from "next/server";
// import Job from "@/models/job";
// import Application from "@/models/application";  // Import the Application model
// import { connect } from "@/lib/dbConfig";

// connect();

// export async function GET(req) {
//   try {
//     // Properly extract page, limit, and searchQuery using .get()
//     const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
//     const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");
//     const searchQuery = req.nextUrl.searchParams.get("searchQuery") || ""; // Extract searchQuery

//     // Calculate the skip value based on page and limit
//     const skip = (page - 1) * limit;

//     // Prepare the query
//     let query = {};

//     // If a search query is provided, filter based on jobTitle (or any other field you want to search)
//     if (searchQuery) {
//       query.jobTitle = { $regex: searchQuery, $options: "i" }; // Case-insensitive search
//     }

//     // Get the jobs with pagination and filter based on search query if provided
//     const jobs = await Job.find(query)
//       .skip(skip)  // Skip the jobs based on current page
//       .limit(limit)  // Limit the number of jobs returned per page
//       .sort({ createdAt: -1 });

//     // Map through each job and add the number of applications for that job
//     const jobsWithApplicationCount = await Promise.all(
//       jobs.map(async (job) => {
//         // Count applications for each job
//         const applicationCount = await Application.countDocuments({ job_id: job._id });

//         // Return the job object with the additional application count
//         return {
//           ...job.toObject(),
//           applicationCount,  // Add the count to each job object
//         };
//       })
//     );

//     // Get the total count of jobs to calculate total pages based on search or total count
//     const totalCount = await Job.countDocuments(query); // Count the jobs with the same query

//     // Return the jobs with application counts, totalPages, and totalCount
//     return NextResponse.json({
//       jobs: jobsWithApplicationCount,
//       totalPages: Math.ceil(totalCount / limit),  // Calculate total pages
//       totalCount: totalCount,  // Return the total count of records matching search query or all records
//     });
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     return NextResponse.json({ error: "Error fetching jobs" }, { status: 500 });
//   }
// }

// above is without mongo regex working


// import { NextResponse } from "next/server";
// import Job from "@/models/job";
// import Application from "@/models/application";  // Import the Application model
// import { connect } from "@/lib/dbConfig";

// connect();

// export async function GET(req) {
//   try {
//     const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
//     const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");
//     const searchQuery = req.nextUrl.searchParams.get("searchQuery") || ""; 



//     // Calculate the skip value based on page and limit
//     const skip = (page - 1) * limit;

//     // Prepare the query
//     let query = {};

//     // If a search query is provided, use regex for full-text search
//     if (searchQuery) {
//       query.jobTitle = { $regex: searchQuery, $options: "i" }; // Case-insensitive search using regex
//     }

//     // Get the jobs with pagination and filter based on search query if provided
//     const jobs = await Job.find(query)
//       .skip(skip)  // Skip the jobs based on current page
//       .limit(limit)  // Limit the number of jobs returned per page
//       .sort({ createdAt: -1 });

//     // Map through each job and add the number of applications for that job
//     const jobsWithApplicationCount = await Promise.all(
//       jobs.map(async (job) => {
//         // Count applications for each job
//         const applicationCount = await Application.countDocuments({ job_id: job._id });

//         // Return the job object with the additional application count
//         return {
//           ...job.toObject(),
//           applicationCount,  // Add the count to each job object
//         };
//       })
//     );

//     // Get the total count of jobs to calculate total pages based on search or total count
//     const totalCount = await Job.countDocuments(query); // Count the jobs with the same query

//     // Return the jobs with application counts, totalPages, and totalCount
//     return NextResponse.json({
//       jobs: jobsWithApplicationCount,
//       totalPages: Math.ceil(totalCount / limit),  // Calculate total pages
//       totalCount: totalCount,  // Return the total count of records matching search query or all records
//     });
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     return NextResponse.json({ error: "Error fetching jobs" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import Job from "@/models/job";
import Application from "@/models/application";  
import { connect } from "@/lib/dbConfig";

connect();

export async function GET(req) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "50");
  const searchQuery = req.nextUrl.searchParams.get("searchQuery") || ""; 
  const timeRange = req.nextUrl.searchParams.get("timeRange") || "";
  const jobStatus = req.nextUrl.searchParams.get("jobStatus") || "";
  const jobType = req.nextUrl.searchParams.get("jobType") || ""; // 🆕 Get job type from request
  try {

    const skip = (page - 1) * limit;

    let query = {};

    if (searchQuery) {
      query.jobTitle = { $regex: searchQuery, $options: "i" };
    }

    if (timeRange) {
      const now = Math.floor(Date.now() / 1000);
      let timeFilter = {};

      if (timeRange === "lastWeek") {
        timeFilter = { $gte: now - 7 * 24 * 60 * 60 };
      } else if (timeRange === "lastMonth") {
        timeFilter = { $gte: now - 30 * 24 * 60 * 60 };
      } else if (timeRange === "last3Months") {
        timeFilter = { $gte: now - 90 * 24 * 60 * 60 };
      } else if (timeRange === "last6Months") {
        timeFilter = { $gte: now - 180 * 24 * 60 * 60 };
      } else if (timeRange === "lastYear") {
        timeFilter = { $gte: now - 365 * 24 * 60 * 60 };
      }

      query.createdAt = timeFilter;
    }

    if (jobStatus) {
      query.jobStatus = parseInt(jobStatus);
    }

    if (jobType) {
      query.jobType = parseInt(jobType); // 🆕 Filter by job type
    }

    const jobs = await Job.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });

    const jobsWithApplicationCount = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount = await Application.countDocuments({ job_id: job._id });
        return { ...job.toObject(), applicationCount };
      })
    );

    const totalCount = await Job.countDocuments(query);

    const response = NextResponse.json({
      jobs: jobsWithApplicationCount,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    });

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ error: "Error fetching jobs" }, { status: 500 });
  }
}
