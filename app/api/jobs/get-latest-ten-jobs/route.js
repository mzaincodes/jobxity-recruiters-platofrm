import { NextResponse } from "next/server";
import Job from "@/models/job";
import { connect } from "@/lib/dbConfig";

connect();

export async function GET(req) {
  try {
    const jobs = await Job.find({ jobStatus: 1 }) // Only get jobs with jobStatus = 1
      .sort({ updatedAt: -1 }) // Sort by updatedAt in descending order (latest first)
      .limit(10); // Get only the latest 10 jobs

    const response = NextResponse.json({ jobs });
    
    // Prevent caching to ensure fresh data on every request
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
