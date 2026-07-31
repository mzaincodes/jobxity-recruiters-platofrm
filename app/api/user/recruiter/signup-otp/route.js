import { NextResponse } from "next/server";
import Recruiter from "@/models/recruiter"; // Recruiter model
import { connect } from "@/lib/dbConfig";
import Candidate from "@/models/candidate";
connect(); 

export async function POST(req) {
  try {
    const { email, v_otp } = await req.json();

    if (!email || !v_otp) {
      return NextResponse.json({ success: false, message: "Email and v_otp are required" }, { status: 400 });
    }

    // Find the recruiter by email
    const recruiter =
    (await Recruiter.findOne({ email })) ||
    (await Candidate.findOne({ email }));
  

    if (!recruiter) {
      return NextResponse.json({ success: false, message: "Recruiter not found" }, { status: 404 });
    }

    // Check if OTP has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (!recruiter.v_otpExpiry || recruiter.v_otpExpiry < currentTime) {
      return NextResponse.json({ success: false, message: "OTP has expired" }, { status: 400 });
    }

    // Check if v_otp matches
    if (recruiter.v_otp !== v_otp) {
      return NextResponse.json({ success: false, message: "Invalid v_otp" }, { status: 400 });
    }

    // Update isVerified field
    recruiter.isVerified = true;
    recruiter.v_otp = undefined; // Clear v_otp after verification
    recruiter.v_otpExpiry = undefined; // Clear expiry time
    await recruiter.save();

    return NextResponse.json({ success: true, message: "v_otp verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("v_otp Verification Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


// import { NextResponse } from "next/server";
// import Recruiter from "@/models/recruiter";
// import Candidate from "@/models/candidate";
// import { connect } from "@/lib/dbConfig";

// connect();

// export async function POST(req) {
//   try {
//     const { email, v_otp } = await req.json();

//     if (!email || !v_otp) {
//       return NextResponse.json(
//         { success: false, message: "Email and v_otp are required" },
//         { status: 400 }
//       );
//     }

//     // Search email in both Recruiter and Candidate collections
//     const [recruiter, candidate] = await Promise.all([
//       Recruiter.findOne({ email }),
//       Candidate.findOne({ email }),
//     ]);

//     let user = recruiter || candidate;
//     let userType = recruiter ? "recruiter" : candidate ? "candidate" : null;

//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     // Check if OTP has expired
//     const currentTime = Math.floor(Date.now() / 1000);
//     if (!user.v_otpExpiry || user.v_otpExpiry < currentTime) {
//       return NextResponse.json(
//         { success: false, message: "OTP has expired" },
//         { status: 400 }
//       );
//     }

//     // Check if OTP matches
//     if (user.v_otp !== v_otp) {
//       return NextResponse.json(
//         { success: false, message: "Invalid v_otp" },
//         { status: 400 }
//       );
//     }

//     // Update verification status
//     user.isVerified = true;
//     user.v_otp = undefined;
//     user.v_otpExpiry = undefined;
//     await user.save();

//     return NextResponse.json(
//       {
//         success: true,
//         message: `${userType} verified successfully`,
//         userType,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("v_otp Verification Error:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
