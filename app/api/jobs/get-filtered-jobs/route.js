

// import { NextResponse } from "next/server";
// import Job from "@/models/job";
// import { connect } from "@/lib/dbConfig";
// import {
//   salaryRange,
// } from "@/data/mydata";
// import { getToken } from "next-auth/jwt";
// export const dynamic = "force-dynamic";
// connect();

// export async function GET(req) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   const { searchParams } = new URL(req.url);
//   try {
//     const searchQuery = searchParams.get("searchQuery");
//     const experience = searchParams.get("experience");
//     const jobType = searchParams.get("jobType");
//     const salary = searchParams.get("salary");
//     const industry = searchParams.get("industry");
//     const city = searchParams.get("city");

//     const page = parseInt(searchParams.get("page")) || 1; // Default page = 1
//     const limit = parseInt(searchParams.get("limit")) || 50; // Default limit = 50

//     const query = {};

//     if (searchQuery) {
//       query.jobTitle = { $regex: searchQuery, $options: "i" };
//     }

//     if (experience) {
//       query.requiredExperience = experience;
//     }

//     if (jobType) {
//       query.jobType = jobType;
//     }

//     if (salary) {
//       const selectedSalary = salaryRange.find(
//         (s) => s.value.trim() === salary.trim()
//       );
//       if (selectedSalary) {
//         query.$and = [
//           { minSalary: { $gte: selectedSalary.min } }, // minSalary >= selected minSalary
//           { maxSalary: { $lte: selectedSalary.max } }, // maxSalary <= selected maxSalary
//         ];
//       }
//     }

//     if (industry) {
//       query.industry = industry;
//     }
//     if (city) {
//       query["address.city"] = city;
//     }
//     if (Number(token.role) === 1) {

//     } else {
//       query.jobStatus = 1;
//     }

//     console.log("query", Number(token.role));

//     const totalJobs = await Job.countDocuments(query); // Get total job count
//     const jobs = await Job.find(query)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit) // Skip previous pages
//       .limit(limit); // Limit results

//     const response = NextResponse.json({
//       jobs,
//       totalJobs, // Total count of filtered jobs
//       totalPages: Math.ceil(totalJobs / limit), // Total number of pages
//       currentPage: page, // Current page
//     });

//     // Add cache control headers to prevent caching
//     response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//     response.headers.set('Pragma', 'no-cache');
//     response.headers.set('Expires', '0');
//     response.headers.set('Surrogate-Control', 'no-store');

//     return response;
//   } catch (error) {
//     console.error("Error fetching jobs:", error);
//     return NextResponse.json({ error: "Error fetching jobs" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import Job from "@/models/job";
import { connect } from "@/lib/dbConfig";
import { salaryRange } from "@/data/mydata";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

connect();

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { searchParams } = new URL(req.url);

  try {
    const searchQuery = searchParams.get("searchQuery");
    const experience = searchParams.get("experience");
    const jobType = searchParams.get("jobType");
    const salary = searchParams.get("salary");
    const industry = searchParams.get("industry");
    const city = searchParams.get("city");

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;

    const query = {};

    // Add filters based on query params
    if (searchQuery) {
      query.jobTitle = { $regex: searchQuery, $options: "i" };
    }

    if (experience) {
      query.requiredExperience = experience;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (salary) {
      const selectedSalary = salaryRange.find(
        (s) => s.value.trim() === salary.trim()
      );
      if (selectedSalary) {
        query.$and = [
          { minSalary: { $gte: selectedSalary.min } },
          { maxSalary: { $lte: selectedSalary.max } },
        ];
      }
    }

    if (industry) {
      query.industry = industry;
    }

    if (city) {
      query["address.city"] = city;
    }

    // 🔒 Role-based access filtering
    if (!token?.role || Number(token.role) !== 1) {
      query.jobStatus = 1; // Only show active jobs
    }

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const response = NextResponse.json({
      jobs,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: page,
    });

    // Disable caching
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
