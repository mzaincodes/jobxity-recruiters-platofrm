import axios from "axios";
import { setupAxiosCacheBusting } from "@/utils/api-utils";

// Use environment variable for production, fallback to localhost for development
export const BASE_URL = "https://www.jobxity.com";

// Setup cache-busting for all axios requests
setupAxiosCacheBusting(axios);

export async function updateUserRole(id, newRole) {
  try {
    const response = await axios.put(
      `/api/user/recruiter/update-user?id=${id}`,
      {
        role: newRole,
      }
    );

    return response?.data;
  } catch (error) {
    console.error(
      "Error updating role:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Something went wrong" };
  }
}

// export async function updateUserCV(id, cv) {
//   try {
//     const response = await axios.put(
//       `${BASE_URL}/api/user/recruiter/update-user?id=${id}`,
//       { cv: cv }
//     );
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error updating CV URL:",
//       error.response?.data || error.message
//     );
//     throw error.response?.data || { message: "Something went wrong" };
//   }
// }

// lib/api.js


export async function updateUserCV(id, cvUrl, publicId) {
  try {
    const response = await axios.post(
      `/api/user/recruiter/update-cv?id=${encodeURIComponent(id)}`,
      {
        cv: cvUrl, // matches your schema’s `cv` field
        cvPublicId: publicId, // matches your schema’s `cvPublicId` field
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (err) {
    // extract message from server or fallback
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Failed to update CV";
    console.error("updateUserCV error:", message);
    throw new Error(message);
  }
}


export async function updateUserPic(id, picUrl, publicId) {

  try {
    const response = await axios.post(
      `/api/user/recruiter/update-pic?id=${encodeURIComponent(id)}`,
      {
        pic: picUrl,
        picPublicId: publicId,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (err) {
    const message =
      err.response?.data?.message ||
      err.response?.data ||
      err.message ||
      "Failed to update Picture";
    console.error("updateUserPic error:", message);
    throw new Error(message);
  }
}


export const getAllCandidates = async () => {
  try {
    const response = await axios.get(
      `/api/user/candidate/get-candidates?t=${Date.now()}`
    );
    console.log("wfwerff", response?.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return [];
  }
};


export const getSingleJob = async (jobId, candidateId) => {
  try {
    const response = await axios.get(
      `/api/jobs/get-single-job/${jobId}?myId=${candidateId}&t=${Date.now()}`
    );

    return response.data; // will contain { job, alreadyApplied }
  } catch (error) {
    console.error("Error fetching job details:", error);
    return { job: null, alreadyApplied: false };
  }
};
