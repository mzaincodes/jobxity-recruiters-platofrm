// import Link from "next/link";
// import LoginWithSocial from "./LoginWithSocial";

// const FormContent = () => {
//   return (
//     <div className="form-inner">
//       <h3>Login to Jobxity</h3>

//       {/* <!--Login Form--> */}
//       <form method="post">
//         <div className="form-group">
//           <label className="auth-fields-labels">email</label>
//           <input
//             className="auth-fields-height"
//             type="text"
//             name="email"
//             placeholder="email"
//             required
//           />
//         </div>
//         {/* name */}

//         <div className="form-group">
//           <label className="auth-fields-labels">Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             required
//             className="auth-fields-height"
//           />
//         </div>
//         {/* password */}

//         <div className="form-group">
//           <div className="field-outer">
//             <div className="input-group checkboxes square">
//               <input type="checkbox" name="remember-me" id="remember" />
//               <label htmlFor="remember" className="remember">
//                 <span className="custom-checkbox"></span> Remember me
//               </label>
//             </div>
//             <a href="#" className="pwd">
//               Forgot password?
//             </a>
//           </div>
//         </div>
//         {/* forgot password */}

//         <div className="form-group">
//           <button
//             className="theme-btn btn-style-one"
//             type="submit"
//             name="log-in"
//           >
//             Log In
//           </button>
//         </div>
//         {/* login */}
//       </form>
//       {/* End form */}

//       <div className="bottom-box">
//         <div className="text">
//           Don&apos;t have an account?{" "}
//           <Link
//             href="#"
//             className="call-modal signup"
//             data-bs-toggle="modal"
//             data-bs-target="#registerModal"
//           >
//             Signup
//           </Link>
//         </div>

// <div className="divider">
//   <span>or</span>
// </div>

//         <div className="mb-3">
//           <span>Login with</span>
//         </div>

//         <LoginWithSocial />
//       </div>
//       {/* End bottom-box LoginWithSocial */}
//     </div>
//   );
// };

// export default FormContent;

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import LoginWithSocial from "./LoginWithSocial";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { TickVerifiedIcon } from "@/public/svg/svg";
// import { useUser } from "@/app/context/UserContext";
import { signIn, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const schema = z.object({
  email: z.string().min(1, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /(?=.*\d)(?=.*[A-Z])/,
      "Password must contain at least one digit and one uppercase letter"
    ),
});

const FormContent = ({ onForgotPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  // const { manualLogin } = useUser();
  const {
    register,
    handleSubmit,
    setError: setFormError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const pathname = usePathname(); // Get the current route

  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async (data) => {
    setLoading(true);
    setError("");

    try {
      const response = await signIn("credentials", {
        redirect: false, // Prevent automatic redirection
        email: data.email,
        password: data.password,
      });

      if (response?.error) {
        setError(response?.error);
      } else {
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  // Wait for session to update and redirect accordingly
  useEffect(() => {
    if (status === "authenticated" && pathname === "/") {
      if (session.user.role == 1) {
        router.push("/employers-dashboard/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [session, status, pathname]);

  return (
    <>
      {!success ? (
        <div className="form-inner">
          <h3>Login to Jobxity</h3>

          {/* Login Form */}
          <form onSubmit={handleSubmit(login)}>
            <div className="form-group">
              <label className="auth-fields-labels">Email</label>
              <input
                className="auth-fields-height"
                type="text"
                {...register("email")}
                placeholder="Enter your email"
                onChange={(e) => {
                  // Ensure the email is always in lowercase
                  const lowercasedEmail = e.target.value.toLowerCase();
                  setEmail(lowercasedEmail); // Update local state with lowercase
                  setValue("email", lowercasedEmail); // Update react-hook-form value
                }}
              />
              {errors.email && (
                <p
                  className="error-text"
                  style={{ color: "red", fontSize: "12px" }}
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="form-group" style={{ position: "relative" }}>
              <label className="auth-fields-labels">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="login-password-field"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Password"
                  autoComplete="on"
                  className="auth-fields-height"
                  style={{ width: "100%", paddingRight: "35px" }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? (
                    <i className="bi bi-eye-slash"></i>
                  ) : (
                    <i className="bi bi-eye"></i>
                  )}
                </span>
              </div>
              {errors.password && (
                <p
                  className="error-message"
                  style={{ color: "red", fontSize: "12px", marginTop: "5px" }}
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <p
                style={{
                  color: "red",
                  fontSize: "14px",
                  textAlign: "left",
                  marginTop: "10px",
                }}
              >
                {error}
              </p>
            )}

            <div className="form-group">
              <div className="field-outer">
                <div className="input-group checkboxes square">
                  <input type="checkbox" name="remember-me" id="remember" />
                  <label htmlFor="remember" className="remember">
                    {/* <span className="custom-checkbox"></span> Remember me */}
                  </label>
                </div>
                <a href="#" className="pwd" onClick={onForgotPassword}>
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="form-group">
              <button
                className="theme-btn btn-style-one"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <BeatLoader
                    color={color}
                    loading={loading}
                    cssOverride={override}
                    size={6}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>

          <div className="bottom-box ">
            <div
              style={{
                width: "100%",
                border: "1px solid blue",
                height: "40px",
                borderRadius: "10px",
                marginTop: "-5px",
              }}
              className="text d-flex justify-content-center align-items-center"
            >
              <Link
                href="#"
                className="call-modal signup"
                data-bs-toggle="modal"
                data-bs-target="#registerModal"
              >
                Signup
              </Link>
            </div>

            <div className="divider mt-3">
              <span>or login with</span>
            </div>
            {/* <div className="mb-3">
              <span>Login with</span>
            </div> */}
            <LoginWithSocial />
          </div>
        </div>
      ) : (
        <div className="form-inner">
          <div className="d-flex mb-4 justify-content-center align-item-center">
            <TickVerifiedIcon />
          </div>
          <h3>Login Successful</h3>
        </div>
      )}
    </>
  );
};

export default FormContent;
