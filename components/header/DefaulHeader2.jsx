"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderNavContent from "./HeaderNavContent";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { isActiveLink } from "@/utils/linkActiveChecker";
import { usePathname } from "next/navigation";
import userProfileIcon from "@/data/userProfileIcon";
// import { useUser } from "@/app/context/UserContext";

const DefaulHeader2 = () => {
  const [navbar, setNavbar] = useState(false);
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const pathname = usePathname();

  // console.log("User Data:", userData?.name);

  useEffect(() => {
    setEmail(session?.user?.email);
  }, [session]);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  const setCookie = (name, value, hours) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + hours * 60 * 60 * 1000); // Convert hours to milliseconds
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
  };

  useEffect(() => {
    if (session?.user?.email) {
      const encodedEmail = btoa("jobxityrecruiters"); // Base64 encode the email
      setCookie("org", encodedEmail, 24); // Store for 1 hour
    }
  }, [session]);

  return (
    // <!-- Main Header-->
    <header
      className={`main-header  ${
        navbar ? "fixed-header animated slideInDown" : ""
      }`}
    >
      {/* <!-- Main box --> */}
      <div className="main-box">
        {/* <!--Nav Outer --> */}
        <div className="nav-outer">
          <div className="logo-box">
            <div className="logo">
              <Link href="/">
                <Image
                  width={154}
                  height={70}
                  src="/images/jobxity.png"
                  priority
                  alt="brand"
                />
              </Link>
            </div>
          </div>
          {/* End .logo-box */}
          <div style={{ width: "10vw" }}></div>

          <HeaderNavContent />
          {/* <!-- Main Menu End--> */}
        </div>
        {/* End .nav-outer */}

        <div className="outer-box">
          {/* <!-- Add Listing --> */}
          {/* <Link href="/candidates-dashboard/cv-manager" className="upload-cv">
            Upload your CV
          </Link> */}
          {/* <!-- Login/Register --> */}
          {session ? (
            <div className="dropdown dashboard-option">
              <a
                className="dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <Image
                  alt="avatar"
                  className="thumb"
                  src={
                    session?.user?.image ||
                    "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid"
                  }
                  width={50}
                  height={50}
                />

                <span className="name">{session?.user?.name}</span>
              </a>

              <ul className="dropdown-menu mt-3 custom-margin-logout-card">
                {userProfileIcon.map((item) => (
                  <li
                    className={`${
                      isActiveLink(item.routePath, pathname) ? "active" : ""
                    } mb-1`}
                    key={item.id}
                  >
                    <Link href={item.routePath}>
                      <button
                        onClick={(e) => {
                          if (item.id === 11) {
                            e.preventDefault();
                            clearEmailCookie();
                            // logoutUser();
                            signOut({ callbackUrl: "/" }); // Call the logout function
                          }
                        }}
                        className="d-flex justify-left align-items-center"
                      >
                        <i className={`la ${item.icon}`}></i> {item.name}
                      </button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="outer-box">
              {!pathname.includes("apply") ? (
                <div className="btn-box">
                  <a
                    href="#"
                    className="theme-btn btn-style-three call-modal"
                    data-bs-toggle="modal"
                    data-bs-target="#loginPopupModal"
                  >
                    Login / Register
                  </a>
                </div>
              ) : (
                <div className="btn-box">
                  <a href="/" className="theme-btn btn-style-three call-modal">
                    Login / Register
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DefaulHeader2;

export const clearEmailCookie = () => {
  document.cookie = "org=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const getDecodedEmailFromCookie = () => {
  const cookies = document.cookie.split("; ");
  const emailCookie = cookies.find((row) => row.startsWith("eum="));

  if (!emailCookie) return null;

  const encodedEmail = emailCookie.split("=")[1];
  return atob(encodedEmail); // Decode Base64 email
};
