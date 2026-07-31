import { NextResponse } from "next/server";
import { connect } from "@/lib/dbConfig";
import Recruiter from "@/models/recruiter";
import { generateOtp } from "@/utils/helper";
import bcrypt from "bcryptjs";

connect();

export async function POST(req) {
  try {
    const { firstName, lastName, email, phone, password, role} = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if the recruiter already exists
    const existingRecruiter = await Recruiter.findOne({ email });

    if (existingRecruiter) {
      if (existingRecruiter.isVerified) {
        return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
      } else {
        // Update existing unverified recruiter
        const hashedPassword = await bcrypt.hash(password, 10);
        const { otp, expiry } = await generateOtp(email); // FIX: Await generateOtp with email

        existingRecruiter.name = `${firstName} ${lastName}`;
        existingRecruiter.phone = phone;
        existingRecruiter.password = hashedPassword;
        existingRecruiter.v_otp = otp;
        existingRecruiter.v_otpExpiry = expiry;
        existingRecruiter.source = 'M';
        await existingRecruiter.save();

        return NextResponse.json(
          { message: "Existing recruiter updated. OTP sent.", recruiter: existingRecruiter },
          { status: 200 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP and expiry
    const { otp, expiry } = await generateOtp(email);

    // Create new recruiter
    const newRecruiter = await Recruiter.create({
      name: `${firstName} ${lastName}`,
      role: role.toString(), // make it dynamic now instead of hardcoding
      email,
      phone,
      password: hashedPassword,
      v_otp: otp,
      v_otpExpiry: expiry,
      isVerified: false,
      source: 'M',
    });

    return NextResponse.json(
      { message: "Recruiter registered successfully. OTP sent.", recruiter: newRecruiter },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering recruiter:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import { connect } from "@/lib/dbConfig";
// import Recruiter from "@/models/recruiter";
// import Candidate from "@/models/candidate";
// import { generateOtp } from "@/utils/helper";
// import bcrypt from "bcryptjs";

// connect();

// export async function POST(req) {
//   try {
//     const {
//       firstName,
//       lastName,
//       email,
//       phone,
//       role,
//       password,
//     } = await req.json();

//     if (!email || !password || !role) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const { otp, expiry } = await generateOtp(email);

//     if (role === "3") {
//       // Handle Recruiter (ROLE 3)
//       const existingRecruiter = await Recruiter.findOne({ email });

//       if (existingRecruiter) {
//         if (existingRecruiter.isVerified) {
//           return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
//         }

//         existingRecruiter.name = `${firstName} ${lastName}`;
//         existingRecruiter.phone = phone;
//         existingRecruiter.password = hashedPassword;
//         existingRecruiter.v_otp = otp;
//         existingRecruiter.v_otpExpiry = expiry;
//         existingRecruiter.source = "M";

//         await existingRecruiter.save();

//         return NextResponse.json(
//           { message: "Existing recruiter updated. OTP sent.", user: existingRecruiter },
//           { status: 200 }
//         );
//       }

//       const newRecruiter = await Recruiter.create({
//         name: `${firstName} ${lastName}`,
//         email,
//         phone,
//         role,
//         password: hashedPassword,
//         v_otp: otp,
//         v_otpExpiry: expiry,
//         isVerified: false,
//         source: "M",
//       });

//       return NextResponse.json(
//         { message: "Recruiter registered successfully. OTP sent.", user: newRecruiter },
//         { status: 201 }
//       );
//     }

//     else if (role === "5") {
//       // Handle Candidate (ROLE 5)
//       const existingCandidate = await Candidate.findOne({ email });

//       if (existingCandidate) {
//         if (existingCandidate.isVerified) {
//           return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
//         }

//         existingCandidate.name = `${firstName} ${lastName}`;
//         existingCandidate.phone = phone || phone;
//         existingCandidate.password = hashedPassword;
//         existingCandidate.v_otp = otp;
//         existingCandidate.v_otpExpiry = expiry;
//         existingCandidate.source = "M";

//         await existingCandidate.save();

//         return NextResponse.json(
//           { message: "Existing candidate updated. OTP sent.", user: existingCandidate },
//           { status: 200 }
//         );
//       }

//       const newCandidate = await Candidate.create({
//         name: `${firstName} ${lastName}`,
//         role,
//         email,
//         phone: phone,
//         currentCompanyName,
//         totalExperience,
//         currentSalary,
//         expectedSalary,
//         noticePeriod,
//         remarks,
//         createdBy,
//         password: hashedPassword,
//         v_otp: otp,
//         v_otpExpiry: expiry,
//         isVerified: false,
//         source: "M",
//       });

//       return NextResponse.json(
//         { message: "Candidate registered successfully. OTP sent.", user: newCandidate },
//         { status: 201 }
//       );
//     }

//     return NextResponse.json({ error: "Invalid role" }, { status: 400 });
//   } catch (error) {
//     console.error("Registration error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// import { NextResponse } from "next/server";
// import { connect } from "@/lib/dbConfig";
// import Recruiter from "@/models/recruiter";
// import Candidate from "@/models/candidate";
// import { generateOtp } from "@/utils/helper";
// import bcrypt from "bcryptjs";

// connect();

// export async function POST(req) {
//   try {
//     const { firstName, lastName, email, phone, password, role } =
//       await req.json();

//     console.log("Received data:", {
//       firstName,
//       lastName,
//       email,
//       phone,
//       password,
//       role,
//     });

//     if (!email) {
//       return NextResponse.json({ error: "Email is required" }, { status: 400 });
//     }

//     if (!role || (role !== "3" && role !== "5")) {
//       return NextResponse.json(
//         { error: "Invalid or missing role" },
//         { status: 400 }
//       );
//     }

//     const fullName = `${firstName} ${lastName}`;
//     const Model = role === "3" ? Recruiter : Candidate;

//     // Check if user already exists
//     const existingUser =
//       (await Recruiter.findOne({ email})) ||
//       (await Candidate.findOne({ email}));

//     if (existingUser) {
//       if (existingUser.isVerified) {
//         return NextResponse.json(
//           { error: "Email is already registered" },
//           { status: 400 }
//         );
//       } else {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const { otp, expiry } = await generateOtp(email);

//         existingUser.name = fullName;
//         existingUser.phone = phone;
//         existingUser.password = hashedPassword;
//         existingUser.v_otp = otp;
//         existingUser.v_otpExpiry = expiry;
//         existingUser.source = "M";

//         await existingUser.save();

//         return NextResponse.json(
//           { message: "Existing user updated. OTP sent.", user: existingUser },
//           { status: 200 }
//         );
//       }
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Generate OTP
//     const { otp, expiry } = await generateOtp(email);

//     // Create new user (Recruiter or Candidate)
//     const newUser = await Model.create({
//       name: fullName,
//       role,
//       email,
//       phone,
//       password: hashedPassword,
//       v_otp: otp,
//       v_otpExpiry: expiry,
//       isVerified: false,
//       source: "M",
//     });

//     console.log('weferwefweff', password, hashedPassword);

//     return NextResponse.json(
//       {
//         message: `${
//           role === "3" ? "Recruiter" : "Candidate"
//         } registered successfully. OTP sent.`,
//         user: newUser,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error registering user:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
