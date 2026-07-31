// import Recruiter from "@/models/recruiter";
// import { connect } from "@/lib/dbConfig";

// // Connect to the database
// connect();

// export async function GET(req) {
//   console.log("gwergw");
//   try {
//     // Step 1: Fetch all recruiters with role "5", select necessary fields and populate 'createdBy' with the name
//     const recruiters = await Recruiter.find({ role: "5" })
//       .select("_id name email phone createdBy pic") // Select fields you need from recruiter
//       .populate({
//         path: 'createdBy', // Path to the referenced field (createdBy)
//         select: '_id name' // Fields to include from the referenced recruiter
//       })
//       .lean(); // .lean() for better performance with plain JavaScript objects

//     // Step 2: Return the recruiters with populated 'createdBy' information
//     return new Response(JSON.stringify(recruiters), { status: 200 });
//   } catch (error) {
//     console.error("Error fetching recruiters:", error);
//     return new Response(JSON.stringify({ error: "Failed to fetch recruiters" }), { status: 500 });
//   }
// // }


// import Recruiter from "@/models/recruiter";
// import { connect } from "@/lib/dbConfig";

// // Connect to the database
// connect();

// export async function GET(req) {
//   const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
//   const limit = parseInt(req.nextUrl.searchParams.get("limit") || "100");
//   const searchQuery = req.nextUrl.searchParams.get("searchQuery") || ""; 

//   try {
//     const skip = (page - 1) * limit;
    
//     let query = { role: "5" }; // Filter by role 5
//     console.log("sfdqefr")

//     if (searchQuery) {
//       query.name = { $regex: searchQuery, $options: "i" }; // Search by name
//     }
    
//     // Fetch recruiters with pagination and search query
//     const recruiters = await Recruiter.find(query)
//       .select("_id name email phone createdBy pic")
//       .populate({
//         path: 'createdBy',
//         select: '_id name'
//       })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     // Get total count for pagination
//     const totalCount = await Recruiter.countDocuments(query);
//     // Return the results
//     return new Response(
//       JSON.stringify({
//         recruiters,
//         totalCount,
//         totalPages: Math.ceil(totalCount / limit)
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching recruiters:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to fetch recruiters" }),
//       { status: 500 }
//     );
//   }
// }


// import Recruiter from "@/models/recruiter";
// import { connect } from "@/lib/dbConfig";

// // Connect to the database
// connect();

// export async function GET(req) {
//   const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
//   const limit = parseInt(req.nextUrl.searchParams.get("limit") || "100");
//   const searchQuery = req.nextUrl.searchParams.get("searchQuery") || "";

//   try {
//     const skip = (page - 1) * limit;

//     // Define the base query to filter by role "5"
//     let query = { role: "5" }; // Filter by role 5

//     // If a search query is provided, apply it to the name field
//     if (searchQuery) {
//       query.name = { $regex: searchQuery, $options: "i" }; // Case-insensitive search by name
//     }

//     // Fetch recruiters with pagination and optional search query
//     const recruiters = await Recruiter.find(query)
//       .select("_id name email phone createdBy pic status") // Select specific fields
//       .populate({
//         path: 'createdBy',
//         select: '_id name', // Only include the createdBy user fields
//       })
//       .skip(skip)
//       .limit(limit)
//       .lean();

//     // Get the total count of recruiters matching the query (without pagination)
//     const totalCount = await Recruiter.countDocuments(query);

//     // Calculate total number of pages
//     const totalPages = Math.ceil(totalCount / limit);

//     // Return the recruiters along with pagination information
//     return new Response(
//       JSON.stringify({
//         recruiters,
//         totalCount,  // Send the total count of recruiters
//         totalPages,  // Send the total number of pages based on the limit
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching recruiters:", error);
//     return new Response(
//       JSON.stringify({ error: "Failed to fetch recruiters" }),
//       { status: 500 }
//     );
//   }
// }



import Recruiter from "@/models/recruiter";
import { connect } from "@/lib/dbConfig";

connect();

export async function GET(req) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "100");
  const searchQuery = req.nextUrl.searchParams.get("searchQuery") || "";
  const status = req.nextUrl.searchParams.get("status") || "";  // Get status filter
  const source = req.nextUrl.searchParams.get("source") || "";  // Get source filter

  try {
    const skip = (page - 1) * limit;

    // Define the base query to filter by role "5"
    let query = { role: "5" }; // Filter by role 5

    // Apply search query to the name field
    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: "i" }; // Case-insensitive search by name
    }

    // Apply the status filter if provided
    if (status) {
      query.status = status; // Filter by recruiter status
    }

    // Apply the source filter
    if (source === "self") {
      query.createdBy = { $exists: false }; // Fetch candidates without createdBy (self-created)
    } else if (source === "recruiter") {
      query.createdBy = { $exists: true }; // Fetch candidates with a createdBy field (recruiter-created)
    }

    // Fetch recruiters with pagination, filters, and optional search query
    const recruiters = await Recruiter.find(query)
      .select("_id name email phone createdBy pic status") // Select specific fields
      .populate({
        path: 'createdBy',
        select: '_id name', // Only include the createdBy user fields
      })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get the total count of recruiters matching the query (without pagination)
    const totalCount = await Recruiter.countDocuments(query);

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCount / limit);

    // Return the recruiters along with pagination information
    const response = new Response(
      JSON.stringify({
        recruiters,
        totalCount,  // Send the total count of recruiters
        totalPages,  // Send the total number of pages based on the limit
      }),
      { status: 200 }
    );

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch recruiters" }),
      { status: 500 }
    );
  }
}
