// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//   ],
//   secret: process.env.NEXTAUTH_SECRET,
// };

// export default authOptions;

// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import LinkedInProvider from "next-auth/providers/linkedin";

// const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     LinkedInProvider({
//       clientId: process.env.LINKEDIN_CLIENT_ID,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//       authorization: { params: { scope: "profile email openid" } },
//       issuer: "https://www.linkedin.com/oauth",
//       jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",

//       async profile(profile) {
//         console.log("LinkedIn Profile Data:", profile);
//         return {
//           id: profile.sub,
//           name: profile.name,
//           firstname: profile.given_name,
//           lastname: profile.family_name,
//           email: profile.email,
//         };
//       },
//     }),
//   ],

//   secret: process.env.NEXTAUTH_SECRET,
// };

// export default authOptions;

// import GoogleProvider from "next-auth/providers/google";
// import LinkedInProvider from "next-auth/providers/linkedin";

// const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     LinkedInProvider({
//       clientId: process.env.LINKEDIN_CLIENT_ID,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//       authorization: { params: { scope: "profile email openid" } },
//       issuer: "https://www.linkedin.com/oauth",
//       jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
//       async profile(profile) {
//         // console.log("LinkedIn Profile Data:", profile);
//         return {
//           id: profile.sub,
//           name: profile.name || `${profile.given_name} ${profile.family_name}`,
//           email: profile.email || profile.email_address,
//           image: profile.picture || profile.pictureUrl,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//         token.email = user.email;
//         token.image = user.image;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id;
//         session.user.name = token.name;
//         session.user.email = token.email;
//         session.user.image = token.image;
//       }
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// export default authOptions;

// import GoogleProvider from "next-auth/providers/google";
// import LinkedInProvider from "next-auth/providers/linkedin";
// import Recruiter from "@/models/recruiter"; // Import the Recruiter model
// import { connect } from "./dbConfig";
// connect();
// const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     LinkedInProvider({
//       clientId: process.env.LINKEDIN_CLIENT_ID,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//       authorization: { params: { scope: "profile email openid" } },
//       issuer: "https://www.linkedin.com/oauth",
//       jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
//       async profile(profile) {
//         return {
//           id: profile.sub,
//           name: profile.name || `${profile.given_name} ${profile.family_name}`,
//           email: profile.email || profile.email_address,
//           image: profile.picture || profile.pictureUrl,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//         token.email = user.email;
//         token.image = user.image;

//         // Save or update the recruiter data in MongoDB after the first login
//         if (user.email) {
//           try {
//             // Check if recruiter already exists
//             const existingRecruiter = await Recruiter.findOne({ email: user.email });

//             if (!existingRecruiter) {
//               // Create a new recruiter if not found
//               const newRecruiter = new Recruiter({
//                 name: user.name,
//                 email: user.email,
//                 pic: user.image,
//                 role: "3", // default role, can change as needed
//                 phone: "", // you may want to handle phone number input separately
//                 country: "", // you may want to handle country input separately
//                 isVerified: true,
//               });

//               // Save the recruiter object in the database
//               await newRecruiter.save();
//             }
//           } catch (error) {
//             console.error("Error saving recruiter to MongoDB:", error);
//           }
//         }
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id;
//         session.user.name = token.name;
//         session.user.email = token.email;
//         session.user.image = token.image;
//       }
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   events: {
//     async signIn(message) {
//       // This event is triggered after a successful sign-in
//       // You can perform additional logic here if needed
//     },
//   },
// };

// export default authOptions;

// import GoogleProvider from "next-auth/providers/google";
// import LinkedInProvider from "next-auth/providers/linkedin";
// import Recruiter from "@/models/recruiter"; // Import the Recruiter model
// import { connect } from "./dbConfig";

// connect();

// const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),
//     LinkedInProvider({
//       clientId: process.env.LINKEDIN_CLIENT_ID,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//       authorization: { params: { scope: "profile email openid" } },
//       issuer: "https://www.linkedin.com/oauth",
//       jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
//       async profile(profile) {
//         return {
//           id: profile.sub,
//           name: profile.name || `${profile.given_name} ${profile.family_name}`,
//           email: profile.email || profile.email_address,
//           image: profile.picture || profile.pictureUrl,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account }) {
//       if (user.email) {
//         try {
//           const existingRecruiter = await Recruiter.findOne({ email: user.email });

//           if (existingRecruiter) {
//             // If the user is signing in with the same provider, allow login
//             if (
//               (account.provider === "google" && existingRecruiter.source.includes("G")) ||
//               (account.provider === "linkedin" && existingRecruiter.source.includes("L"))
//             ) {
//               return true; // Allow login
//             }

//             // If provider does not match the stored source, show error
//             return `/auth/error?error=InvalidProvider&source=${existingRecruiter.source}`;
//           } else {
//             // If not found, create a new recruiter entry
//             const newRecruiter = new Recruiter({
//               name: user.name,
//               email: user.email,
//               pic: user.image,
//               role: "3",
//               phone: "",
//               country: "",
//               isVerified: true,
//               source: account.provider === "google" ? "G" : "L",
//             });

//             await newRecruiter.save();
//           }
//         } catch (error) {
//           console.error("Sign-in error:", error.message);
//           return "/auth/error?error=UnexpectedError";
//         }
//       }
//       return true;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//         token.email = user.email;
//         token.image = user.image;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id;
//         session.user.name = token.name;
//         session.user.email = token.email;
//         session.user.image = token.image;
//       }
//       return session;
//     },
//   },
//   pages: {
//     error: "/auth/error", // Custom error page
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// export default authOptions;

// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import LinkedInProvider from "next-auth/providers/linkedin";
// import bcrypt from "bcryptjs";
// import Recruiter from "@/models/recruiter";
// import { connect } from "./dbConfig";

// connect();

// const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email", placeholder: "user@example.com" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials.email || !credentials.password) {
//           throw new Error("Missing credentials");
//         }

//         try {
//           const user = await Recruiter.findOne({ email: credentials.email });

//           if (!user) {
//             throw new Error("User not found");
//           }

//           const isValidPassword = await bcrypt.compare(credentials.password, user.password);

//           if (!isValidPassword) {
//             throw new Error("Invalid password");
//           }

//           return {
//             id: user._id.toString(),
//             name: user.name,
//             email: user.email,
//             image: user.pic,
//             role: user.role,
//             phone: user.phone,
//             country: user.country,
//             isVerified: user.isVerified,
//             sts: user.sts,
//           };
//         } catch (error) {
//           console.error("Login error:", error);
//           throw new Error(error.message || "Something went wrong");
//         }
//       },
//     }),

//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     }),

//     LinkedInProvider({
//       clientId: process.env.LINKEDIN_CLIENT_ID,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//       authorization: { params: { scope: "profile email openid" } },
//       issuer: "https://www.linkedin.com/oauth",
//       jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
//       async profile(profile) {
//         return {
//           id: profile.sub,
//           name: profile.name || `${profile.given_name} ${profile.family_name}`,
//           email: profile.email || profile.email_address,
//           image: profile.picture || profile.pictureUrl,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account }) {
//       if (user.email) {
//         try {
//           let existingRecruiter = await Recruiter.findOne({ email: user.email });

//           if (existingRecruiter) {
//             // Ensure user logs in with the same provider or manually
//             if (
//               account.provider === "credentials" ||
//               (account.provider === "google" && existingRecruiter.source.includes("G")) ||
//               (account.provider === "linkedin" && existingRecruiter.source.includes("L"))
//             ) {
//               return true; // Allow login
//             }

//             return `/auth/error?error=InvalidProvider&source=${existingRecruiter.source}`;
//           } else {
//             if (account.provider !== "credentials") {
//               existingRecruiter = new Recruiter({
//                 name: user.name,
//                 email: user.email,
//                 pic: user.image,
//                 role: "3",
//                 phone: "",
//                 country: "",
//                 isVerified: true,
//                 source: account.provider === "google" ? "G" : "L",
//               });

//               await existingRecruiter.save();
//             }
//           }
//         } catch (error) {
//           console.error("Sign-in error:", error.message);
//           return "/auth/error?error=UnexpectedError";
//         }
//       }
//       return true;
//     },

//     async jwt({ token, user }) {
//       // Fetch user details from database when session starts
//       if (user || token.email) {
//         const dbUser = await Recruiter.findOne({ email: user?.email || token.email });

//         if (dbUser) {
//           token.id = dbUser._id.toString();
//           token.name = dbUser.name;
//           token.email = dbUser.email;
//           token.image = dbUser.pic;
//           token.role = dbUser.role;
//           token.phone = dbUser.phone;
//           token.country = dbUser.country;
//           token.isVerified = dbUser.isVerified;
//           token.sts = dbUser.sts;
//         }
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (token) {
//         session.user = {
//           id: token.id,
//           name: token.name,
//           email: token.email,
//           image: token.image,
//           role: token.role,
//           phone: token.phone,
//           country: token.country,
//           isVerified: token.isVerified,
//           sts: token.sts,
//         };
//       }
//       return session;
//     },
//   },
//   pages: {
//     error: "/auth/error",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// export default authOptions;

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Recruiter from "@/models/recruiter";
import { connect } from "./dbConfig";

// Connect to your database
connect();

const JWT_SECRET = process.env.JWT_SECRET;

const authOptions = {
  // Use JWT-based sessions
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Missing credentials");
        }

        try {
          const user = await Recruiter.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("User not found");
          }
          if (user.isVerified === false) {
            throw new Error("Email not verified, please signup again");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.pic,
            role: user.role,
            phone: user.phone,
            country: user.country,
            isVerified: user.isVerified,
            sts: user.sts,
            cv: user.cv,
            pic: user.pic,
          };
        } catch (error) {
          console.error("Received login error :", error);
          throw new Error(error.message || "Something went wrong");
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      authorization: { params: { scope: "profile email openid" } },
      issuer: "https://www.linkedin.com/oauth",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || `${profile.given_name} ${profile.family_name}`,
          email: profile.email || profile.email_address,
          image: profile.picture || profile.pictureUrl,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (user.email) {
        try {
          let existingRecruiter = await Recruiter.findOne({
            email: user.email,
          });

          if (existingRecruiter) {
            // Ensure user logs in with the same provider or manually
            if (
              account.provider === "credentials" ||
              (account.provider === "google" &&
                existingRecruiter.source.includes("G")) ||
              (account.provider === "linkedin" &&
                existingRecruiter.source.includes("L"))
            ) {
              return true; // Allow login
            }
            return `/auth/error?error=InvalidProvider&source=${existingRecruiter.source}`;
          } else {
            if (account.provider !== "credentials") {
              existingRecruiter = new Recruiter({
                name: user.name,
                email: user.email,
                pic: user.image,
                role: "0",
                phone: "",
                country: "",
                isVerified: true,
                source: account.provider === "google" ? "G" : "L",
              });
              await existingRecruiter.save();
            }
          }
        } catch (error) {
          console.error("Sign-in error:", error.message);
          return "/auth/error?error=UnexpectedError";
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      // When the user logs in or if token already contains an email, refresh user data from the database
      if (user || token.email) {
        const dbUser = await Recruiter.findOne({
          email: user?.email || token.email,
        });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.image = dbUser.pic;
          token.role = dbUser.role;
          token.phone = dbUser.phone;
          token.country = dbUser.country;
          token.isVerified = dbUser.isVerified;
          token.sts = dbUser.sts;
          token.gender = dbUser.gender;
          token.recruitingExperience = dbUser.recruitingExperience;
          token.totalExperience = dbUser.totalExperience;
          token.description = dbUser.description;
          token.educationLevel = dbUser.educationLevel;
          token.profilePercentage = dbUser.profilePercentage;
          token.address = dbUser.address;
          token.bankDetails = dbUser.bankDetails;
          token.consentDate = dbUser.consentDate;
          token.linkedinUrl = dbUser.linkedinUrl;
          token.cv = dbUser.cv;
          token.pic = dbUser.pic;
        }
      }

      // Create a custom signed JWT token containing user details.
      token.customJwt = jwt.sign(
        {
          id: token.id,
          //   name: token.name,
          //   email: token.email,
          //   image: token.image,
          role: token.role,
          //   phone: token.phone,
          //   country: token.country,
          isVerified: token.isVerified,
          sts: token.sts,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.image,
          role: token.role,
          phone: token.phone,
          country: token.country,
          isVerified: token.isVerified,
          sts: token.sts,
          description: token.description,
          recruitingExperience: token.recruitingExperience,
          totalExperience: token.totalExperience,
          gender: token.gender,
          educationLevel: token.educationLevel,
          profilePercentage: token.profilePercentage,
          address: token.address,
          bankDetails: token.bankDetails,
          consentDate: token.consentDate,
          linkedinUrl: token.linkedinUrl,
          cv: token.cv,
          pic: token.pic,
        };
        // Include the custom JWT in the session so it can be used in middleware or frontend if needed.
        session.jwt = token.customJwt;
      }
      return session;
    },
  },
  pages: {
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;

//     FacebookProvider({
//       clientId: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       profile(profile) {
//         return {
//           id: profile.id,
//           name: profile.name,
//           email: profile.email,
//           image: profile.picture?.data?.url || null,
//         };
//       },
//     }),
