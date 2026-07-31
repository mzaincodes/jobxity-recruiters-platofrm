// import Application from "@/models/application";
// import Job from "@/models/job";
// import { connect } from "@/lib/dbConfig";

// connect();

// export async function GET(request) {
//   try {

//     const applications = await Application.find()
//       .populate("recruiter_id", "name _id")  // Populate recruiter details (name, _id)
//       .populate("candidate_id", "name _id ")  // Populate candidate details (name, _id, email)
//       .populate("job_id", "jobTitle")  // Populate jobTitle from the Job collection
//       .select("status updatedBy updatedAt");

//     // Map over the applications to construct the response
//     const result = applications.map(application => {
//       return {
//         applicationId: application?._id,  // Include the application ID

//         recruiterId: application.recruiter_id?._id,
//         recruiterName: application.recruiter_id?.name,
//         candidateId: application.candidate_id?._id,
//         candidateName: application.candidate_id?.name,
//         candidateEmail: application.candidate_id?.email,
//         status: application.status,
//         updatedBy: application.updatedBy,
//         updatedAt: application.updatedAt,
//         jobTitle: application?.job_id ? application.job_id?.jobTitle : "N/A", // Include jobTitle
//       };
//     });

//     // Return the result array as a response
//     return new Response(JSON.stringify(result), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }







// import Application from "@/models/application";
// import Job from "@/models/job";
// import { connect } from "@/lib/dbConfig";

// connect();

// export async function GET(request) {
//   try {
//     const searchParams = new URL(request.url).searchParams;
//     const page = parseInt(searchParams.get("page")) || 1;
//     const limit = parseInt(searchParams.get("limit")) || 30;    
//     // Calculate skip for pagination
//     const skip = (page - 1) * limit;

//     // Find applications with pagination and populate necessary fields
//     const applications = await Application.find()
//       .populate("recruiter_id", "name _id")  // Populate recruiter details
//       .populate("candidate_id", "name _id email")  // Populate candidate details
//       .populate("job_id", "jobTitle")  // Populate jobTitle
//       .select("status updatedBy updatedAt")
//       .skip(skip)  // Apply pagination skip
//       .limit(limit);  // Apply limit

//     // Get total count of applications for pagination
//     const totalCount = await Application.countDocuments();

//     // Map over the applications to construct the response
//     const result = applications.map(application => {
//       return {
//         applicationId: application?._id,  // Include applicationId
//         recruiterId: application.recruiter_id?._id,
//         recruiterName: application.recruiter_id?.name,
//         candidateId: application.candidate_id?._id,
//         candidateName: application.candidate_id?.name,
//         candidateEmail: application.candidate_id?.email,
//         status: application.status,
//         updatedBy: application.updatedBy,
//         updatedAt: application.updatedAt,
//         jobTitle: application?.job_id ? application.job_id?.jobTitle : "N/A",
//       };
//     });

//     // Return the result array and totalCount as a response
//     return new Response(JSON.stringify({ applications: result, totalCount }), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }






// import Application from "@/models/application";
// import { connect } from "@/lib/dbConfig";

// connect();

// export async function GET(request) {
//   const searchParams = new URL(request.url).searchParams;
//   const searchQuery = searchParams.get("searchQuery");  // Capture the search query (candidate's name)
//   const page = parseInt(searchParams.get("page")) || 1;
//   const limit = parseInt(searchParams.get("limit")) || 30;  
//   const skip = (page - 1) * limit;  // Calculate skip for pagination
//   try {
//     // Construct the query object (no searchQuery filter in the database)
//     const query = {};  // No search query applied here, we'll filter manually in JS

//     // Fetch all applications (do not apply the search filter here)
//     let applications = await Application.find(query)  // Fetch all applications
//       .populate("recruiter_id", "name _id")  // Populate recruiter details
//       .populate("candidate_id", "name _id email")  // Populate candidate details
//       .populate("job_id", "jobTitle")  // Populate jobTitle
//       .select("status updatedBy updatedAt candidate_id recruiter_id job_id");

//     // Manually filter the applications based on search query
//     if (searchQuery) {
//       console.log("Searching with query:", searchQuery);
//       applications = applications.filter(application => 
//         application.candidate_id?.name.toLowerCase().includes(searchQuery.toLowerCase())  // Case-insensitive search
//       );
//       console.log(`Filtered applications count (after search): ${applications.length}`);
//     }

//     // Get the total count of filtered applications (after search query)
//     const filteredCount = applications.length;

//     // Apply pagination to the filtered applications
//     const paginatedApplications = applications.slice(skip, skip + limit);

//     // Map over the applications to construct the response
//     const result = paginatedApplications.map(application => {
//       return {
//         applicationId: application?._id,  // Include applicationId
//         recruiterId: application.recruiter_id?._id,
//         recruiterName: application.recruiter_id?.name,
//         candidateId: application.candidate_id?._id,
//         candidateName: application.candidate_id?.name,
//         candidateEmail: application.candidate_id?.email,
//         status: application.status,
//         updatedBy: application.updatedBy,
//         updatedAt: application.updatedAt,
//         jobTitle: application?.job_id ? application.job_id?.jobTitle : "N/A",
//         jobId: application.job_id?._id,  // Include job_id in the response

//       };
//     });

//     // Return the result array, total filtered count, and total count (for pagination)
//     return new Response(JSON.stringify({
//       applications: result,
//       totalCount: filteredCount,  // Total count of searched results
//     }), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }


// File: /app/api/application/get-applications/route.js (or your route)





// import Application from "@/models/application";
// import { connect } from "@/lib/dbConfig";

// await connect();

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const searchQuery = searchParams.get("searchQuery") || "";
//   const page = parseInt(searchParams.get("page")) || 1;
//   const limit = parseInt(searchParams.get("limit")) || 30;
//   const skip = (page - 1) * limit;

//   try {
//     const query = {}; // No database filtering yet

//     let applications = await Application.find(query)
//       .populate("recruiter_id", "name _id")
//       .populate({
//         path: "candidate_id",
//         select: "name _id email", 
//         model: "Recruiter", // ✅ Populate from Recruiter model
//       })
//       .populate("job_id", "jobTitle")
//       .select("status updatedBy updatedAt candidate_id recruiter_id job_id applicationId")
//       .sort({ updatedAt: -1 }); 
      
//       // Filter manually on candidate name if searchQuery exists
//       if (searchQuery) {
//         applications = applications.filter(application => 
//           application.candidate_id?.name.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//         console.log("ewrgwertg", applications)
//       }
      
//       const filteredCount = applications.length;
      
//       // Paginate manuall
//       const paginatedApplications = applications.slice(skip, skip + limit);
      
//       console.log("Searching with query:", paginatedApplications);
//     const result = paginatedApplications.map(application => ({
//       applicationId: application?._id,
//       appId: application?.applicationId,
//       recruiterId: application.recruiter_id?._id,
//       recruiterName: application.recruiter_id?.name,
//       candidateId: application.candidate_id?._id,
//       candidateName: application.candidate_id?.name,
//       candidateEmail: application.candidate_id?.email,
//       status: application.status,
//       updatedBy: application.updatedBy,
//       updatedAt: application.updatedAt,
//       jobTitle: application?.job_id ? application.job_id?.jobTitle : "N/A",
//       jobId: application.job_id?._id,
//     }));
// console.log("resultwefewrfef", result);
//     return new Response(JSON.stringify({
//       applications: result,
//       totalCount: filteredCount,
//     }), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }


import Application from "@/models/application";
import { connect } from "@/lib/dbConfig";
export const dynamic = 'force-dynamic';

await connect();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("searchQuery") || "";
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 30;
  const skip = (page - 1) * limit;

  try {
    const query = {}; // No database filtering yet

    // Decide if we are searching by applicationId or candidateName
    let applications = await Application.find(query)
      .populate("recruiter_id", "name _id")
      .populate({
        path: "candidate_id",
        select: "name _id email", 
        model: "Recruiter", // ✅ Populate from Recruiter model
      })
      .populate("job_id", "jobTitle")
      .select("status updatedBy updatedAt candidate_id recruiter_id job_id applicationId")
      .sort({ updatedAt: -1 });
    
    // If searchQuery starts with a number, search by applicationId
    if (searchQuery) {
      const firstChar = searchQuery.trim().charAt(0);

      // If the first character is a digit, we search on applicationId
      if (!isNaN(firstChar)) {
        // Remove leading zeros and convert to number
        const applicationIdToSearch = parseInt(searchQuery.replace(/^0+/, ''), 10);

        // Filter applications by applicationId (convert both to numbers)
        applications = applications.filter(application => 
          application.applicationId === applicationIdToSearch
        );
        console.log("Filtered applications based on applicationId:", applications);
      } else {
        // Otherwise, search by candidate name
        applications = applications.filter(application => 
          application.candidate_id?.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        console.log("Filtered applications based on candidate name:", applications);
      }
    }

    const filteredCount = applications.length;

    // Paginate manually
    const paginatedApplications = applications.slice(skip, skip + limit);

    // Map the filtered and paginated applications
    const result = paginatedApplications.map(application => ({
      applicationId: application?._id,  // ✅ use ObjectId
      appId: application?.applicationId || application?._id, 
      recruiterId: application.recruiter_id?._id,
      recruiterName: application.recruiter_id?.name,
      candidateId: application.candidate_id?._id,
      candidateName: application.candidate_id?.name,
      candidateEmail: application.candidate_id?.email,
      status: application.status,
      updatedBy: application.updatedBy,
      updatedAt: application.updatedAt,
      jobTitle: application?.job_id ? application.job_id?.jobTitle : "N/A",
      jobId: application.job_id?._id,
      // currentlyApplyingFor: application.currentlyApplyingFor,
    }));

    const response = new Response(JSON.stringify({
      applications: result,
      totalCount: filteredCount,
    }), { status: 200 });

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error("Error fetching applications:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
