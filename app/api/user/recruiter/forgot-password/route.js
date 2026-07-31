import { NextResponse } from "next/server";
import Recruiter from "@/models/recruiter";
import { connect } from "@/lib/dbConfig";
import { generateOtp } from "@/utils/helper";

connect();
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const recruiter = await Recruiter.findOne({ email });

    if (!recruiter) {
      return NextResponse.json({ error: "Recruiter not found" }, { status: 404 });
    }

    if (recruiter.source === "G" || recruiter.source === "L") {
      return NextResponse.json({ error: "Cannot change password of a social logged in account" }, { status: 404 });
    }
    if (recruiter.isVerified === false) {
      return NextResponse.json({ error: "Your account is not verified please signup again" }, { status: 404 });
    }

    // Generate OTP and expiry
    const { otp, expiry } = await generateOtp(email);

    // Update recruiter with OTP and expiry
    recruiter.f_otp = otp;
    recruiter.f_otpExpiry = expiry;
    await recruiter.save();

    return NextResponse.json(
      { message: "OTP sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


// import { NextResponse } from "next/server";
// import Recruiter from "@/models/recruiter";
// import Candidate from "@/models/candidate";
// import { connect } from "@/lib/dbConfig";
// import { generateOtp } from "@/utils/helper";

// connect();

// export async function POST(req) {
//   try {
//     const { email } = await req.json();

//     if (!email) {
//       return NextResponse.json({ error: "Email is required" }, { status: 400 });
//     }

//     // Find user in both collections
//     const [recruiter, candidate] = await Promise.all([
//       Recruiter.findOne({ email }),
//       Candidate.findOne({ email }),
//     ]);

//     let user = recruiter || candidate;
//     let userType = recruiter ? "recruiter" : candidate ? "candidate" : null;

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // Social login check
//     if (user.source === "G" || user.source === "L") {
//       return NextResponse.json(
//         { error: "Cannot change password of a social logged in account" },
//         { status: 400 }
//       );
//     }

//     // Verification check
//     if (user.isVerified === false) {
//       return NextResponse.json(
//         { error: "Your account is not verified, please signup again" },
//         { status: 400 }
//       );
//     }

//     // Generate OTP and expiry
//     const { otp, expiry } = await generateOtp(email);

//     // Update user document
//     user.f_otp = otp;
//     user.f_otpExpiry = expiry;
//     await user.save();

//     return NextResponse.json(
//       {
//         message: "OTP sent successfully",
//         userType,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Forgot Password Error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
