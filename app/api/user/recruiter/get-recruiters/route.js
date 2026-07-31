


import Recruiter from "@/models/recruiter";
import { connect } from "@/lib/dbConfig";

connect();

export async function GET(req) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "100");
  const searchQuery = req.nextUrl.searchParams.get("searchQuery") || "";
  const status = req.nextUrl.searchParams.get("status") || "";  

  try {
    const skip = (page - 1) * limit;

    let query = { role: "3" }; // Filter by role 5

    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: "i" }; // Case-insensitive search by name
    }

    // Apply the status filter if provided
    if (status) {
      query.status = status; // Filter by recruiter status
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
    return new Response(
      JSON.stringify({
        recruiters,
        totalCount,  // Send the total count of recruiters
        totalPages,  // Send the total number of pages based on the limit
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching recruiters:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch recruiters" }),
      { status: 500 }
    );
  }
}
