import Recruiter from "@/models/recruiter";
import Job from "@/models/job";
import Application from "@/models/application";
import { connect } from "@/lib/dbConfig";
import mongoose from "mongoose";

connect();

export async function GET(request) {
  try {
    // Fetch all recruiters with role "2" (assuming role "2" is for recruiters)
    const recruiters = await Recruiter.find({ role: "2" }).select("name email createdAt _id");

    // Create an array of results to store recruiter details, job count, and application count
    const result = [];

    // Iterate through each recruiter to get the job count and application count
    for (let recruiter of recruiters) {
      // Get the count of jobs posted by this recruiter
      const jobCount = await Job.countDocuments({ jobPostedBy: recruiter._id });

      // Get the count of applications where jobPostedBy matches the recruiter and status is "5"
      const applicationCount = await Application.countDocuments({
        job_id: { $in: await Job.find({ jobPostedBy: recruiter._id }).select('_id').lean().then(jobs => jobs.map(job => job._id)) },
        status: "5", // status is treated as a string
      });

      // Add recruiter details, job count, and application count to the result array
      result.push({
        _id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        createdAt: recruiter.createdAt,
        jobCount: jobCount,
        applicationCount: applicationCount,
      });
    }

    // Return the result array as a response
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error fetching recruiters, jobs, or applications:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
