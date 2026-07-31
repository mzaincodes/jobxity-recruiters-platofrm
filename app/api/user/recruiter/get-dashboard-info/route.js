import Application from "@/models/application";
import Job from "@/models/job";
import Recruiter from "@/models/recruiter";
import { connect } from "@/lib/dbConfig";
import Candidate from "@/models/candidate";

export const dynamic = "force-dynamic";

connect();
export async function GET(request) {
    try {
      // Total number of applications
      const totalApplicationCount = await Application.countDocuments();
  
      // Total number of applications with status "5" (hired)
      const hiredApplications = await Application.countDocuments({ status: "5" });
  
      // Total number of jobs
      const totalJobsPosted = await Job.countDocuments();
  
      // Total number of recruiters with role "3"
      const recruitersCountRole3 = await Recruiter.countDocuments({ role: "3" });
  
      // Total number of recruiters with role "4"
      const recruitersCountRole4 = await Recruiter.countDocuments({ role: "4" });
  
      // Total number of candidates
      const totalCandidatesCount = await Candidate.countDocuments();
  
      // Get the current date and calculate the date range for the last 12 months
      const currentDate = new Date();
      const endOfRange = currentDate.getTime();
      const startOfRange = new Date(currentDate);
      startOfRange.setMonth(currentDate.getMonth() - 11); // 12 months back including the current month
      startOfRange.setDate(1); // Set to the first day of the month
  
      const applicationsPerMonth = await Application.aggregate([
        {
          $match: {
            createdAt: {
              $gte: Math.floor(startOfRange.getTime() / 1000), // Match applications after the start date (12 months ago)
              $lte: Math.floor(endOfRange / 1000) // Match applications before the current date
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: { $toDate: { $multiply: ["$createdAt", 1000] } } },
              month: { $month: { $toDate: { $multiply: ["$createdAt", 1000] } } }
            },
            applications: { $sum: 1 }  // Count applications for each month
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }  // Sort by year and month
        }
      ]);
  
      // Array to map months numerically (1 = January, 12 = December)
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
  
      // Start from 12 months ago and move month by month to the current month
      let currentMonth = new Date(startOfRange);
      const formattedApplicationsPerMonth = [];
  
      // Loop through each of the last 12 months
      for (let i = 0; i < 12; i++) {
        const monthIndex = currentMonth.getMonth(); // Get the current month index
        const year = currentMonth.getFullYear();
  
        // Check if there's any data for this month
        const monthData = applicationsPerMonth.find(
          (item) => item._id.month === monthIndex + 1 && item._id.year === year
        );
  
        // Push the data for the month (use 0 if no data)
        formattedApplicationsPerMonth.push({
          month: monthNames[monthIndex],  // Month name (Jan, Feb, Mar, etc.)
          applications: monthData ? monthData.applications : 0  // If no data, return 0
        });
  
        // Move to the next month
        currentMonth.setMonth(currentMonth.getMonth() + 1);
      }
  
      // Return the response with both the total counts and the monthly data
      const response = new Response(
        JSON.stringify({
          total: {
            totalApplicationCount,
            hiredApplications,
            totalJobsPosted,
            recruitersCountRole3,
            recruitersCountRole4,
            totalCandidatesCount,
          },
          monthlyApplications: formattedApplicationsPerMonth,
        }),
        { status: 200 }
      );

      // Disable caching to always serve fresh stats
      response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      response.headers.set("Surrogate-Control", "no-store");

      return response;
    } catch (error) {
      // In case of any errors, return a 500 server error
      return new Response(
        JSON.stringify({ message: "Error fetching data", error: error.message }),
        { status: 500 }
      );
    }
  }