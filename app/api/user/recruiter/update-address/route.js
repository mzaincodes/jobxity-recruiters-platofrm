import Recruiter from "@/models/recruiter";
import { connect } from "@/lib/dbConfig";
import { getToken } from "next-auth/jwt";

connect();

export async function POST(req) {
  try {
    // Authenticate user
    const token = await getToken({ req });
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Parse request body
    const { _id, country, state, city, postalCode, completeAddress } =
      await req.json();

    if (!_id) {
      return new Response(
        JSON.stringify({ error: "Recruiter ID is required" }),
        { status: 400 }
      );
    }    
    const updatedRecruiter = await Recruiter.findByIdAndUpdate(
      _id,
      {
        $set: {
          "address.country": country,
          "address.state": state,
          "address.city": city,
          "address.postalCode": postalCode,
          "address.completeAddress": completeAddress,
        },
        $inc: { profilePercentage: 25 }, 
      },
      { new: true } // Ensure we return the updated document
    );

    if (!updatedRecruiter) {
      return new Response(JSON.stringify({ error: "Recruiter not found" }), {
        status: 404,
      });
    }


    return new Response(JSON.stringify(updatedRecruiter), { status: 200 });
  } catch (error) {
    console.error("Error updating recruiter:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
