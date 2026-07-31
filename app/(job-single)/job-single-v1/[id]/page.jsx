"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import * as XLSX from "xlsx";
import LoginPopup from "@/components/common/form/login/LoginPopup";
import FooterDefault from "@/components/footer/common-footer";
import { Country, State, City } from "country-state-city";
import MobileMenu from "@/components/header/MobileMenu";
import JobOverView from "@/components/job-single-pages/job-overview/JobOverView";
import JobSkills from "@/components/job-single-pages/shared-components/JobSkills";
import ApplyJobModalContent from "@/components/job-single-pages/shared-components/ApplyJobModalContent";
import axios from "axios";
import {
  getIndustryLabel,
  timeAgo,
  convertTimestampToDate,
  getExperienceLabel,
  getJobModeLabel,
} from "@/utils/helping-func";
import "react-quill/dist/quill.snow.css";
import { industries, jobTypes } from "@/data/mydata";
import { useSession } from "next-auth/react";
import { HashLoader } from "react-spinners";
import DefaulHeader2 from "@/components/header/DefaulHeader2";
import { toast } from "react-toastify";
import JobsPerCandidate from "@/components/dashboard-pages/recruiter-dashboard/short-listed-jobs/components/JobsPerCandidate";
import RecruitersPerJob from "@/components/dashboard-pages/recruiter-dashboard/short-listed-jobs/components/RecruitersPerJob";
import { BASE_URL } from "@/lib/api";
import CandidateApplyJobModal from "@/components/job-single-pages/shared-components/CandidateApplyJobModal";
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

// export const metadata = {
//   title: "Job Single Dyanmic V1 || Superio - Job Borad React NextJS Template",
//   description: "Superio - Job Borad React NextJS Template",
// };

const JobSingleDynamicV1 = ({ params }) => {
  const id = params.id;
  const [job, setJob] = useState(null);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#1966d2");
  const [allApplications, setAllApplications] = useState([]);
  const [copied, setCopied] = useState(false);
  const [maxWidth, setMaxWidth] = useState(getMaxWidth());
  const [applied, setApplied] = useState(false);

  console.log("Session data in Job Single:", session);

  function getMaxWidth() {
    return window.innerWidth < 576 ? "97vw" : "60vw";
  }

  useEffect(() => {
    function handleResize() {
      setMaxWidth(getMaxWidth());
    }

    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCountryName = (isoCode) => {
    const country = Country.getCountryByCode(isoCode);
    return country?.name || isoCode;
  };

  const getStateName = (countryCode, stateCode) => {
    const state = State.getStateByCodeAndCountry(stateCode, countryCode);
    return state?.name || stateCode;
  };

  const handleCopyLink = async () => {
    let recruiterId = session?.user?.id;
    let jobId = id;
    if (!recruiterId || !jobId) {
      alert("Recruiter or Job ID is missing.");
      return;
    }
    const link = `${BASE_URL}/apply/${recruiterId}/${jobId}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 7000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };
  useEffect(() => {
    if (!id || id === "favicon.ico") return;
    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/jobs/get-single-job/${id}?myId=${session?.user?.id}`
        );
        const appsResponse = await axios.get(
          "/api/application/get-all-applications-per-job",
          {
            params: { jobId: id },
          }
        );
        console.log("t4g35tg", res);
        setApplied(res?.data?.alreadyApplied);
        setAllApplications(appsResponse?.data?.applications);
        if (res.status === 200) {
          setJob(res.data.job);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJob();
  }, [id, session?.user?.id]);

  const downloadExcel = (applications, jobTitle) => {
    if (!applications || applications.length === 0) {
      alert("No applications available to download.");
      return;
    }

    // Map and format data to be included in the Excel file
    const formattedData = applications.map((app) => ({
      "Candidate Name": app.candidate_id?.name || "N/A",
      Phone: app.candidate_id?.phone || "N/A",
      Email: app.candidate_id?.email || "N/A",
      Location: app.candidate_id?.location || "N/A",
      "Current Company": app.candidate_id?.currentCompanyName || "N/A",
      "Current Salary": app.candidate_id?.currentSalary || "N/A",
      "Expected Salary": app.candidate_id?.expectedSalary || "N/A",
      "Notice Period": app.candidate_id?.noticePeriod || "N/A",
      Experience:
        getExperienceLabel(app.candidate_id?.totalExperience) || "N/A",
      "Job Title": app.job_id?.jobTitle || "N/A",
      "CV Link": app.cvLink || "N/A",
      // "Applied On": new Date(app.createdAt).toLocaleDateString() || "N/A",
    }));

    // Create a worksheet
    const ws = XLSX.utils.json_to_sheet(formattedData);

    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Applications");

    const today = new Date().toISOString().split("T")[0]; // Get YYYY-MM-DD format
    const sanitizedJobTitle = jobTitle?.replace(/[^a-zA-Z0-9]/g, "_"); // Remove special characters
    const fileName = `Jobxity_${sanitizedJobTitle}_applications_${today}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const industryLabel =
    industries.find((item) => item.value === Number(job?.industry))?.label ||
    "Unknown Industry";

  const jobTypeLabel =
    jobTypes.find((item) => item.value === Number(job?.jobType))?.label ||
    "Unknown Job Type";

  const handleApplyClick = (e) => {
    e.preventDefault(); // Prevent the default behavior of opening the modal

    // Case 1: If session doesn't exist (user is not logged in)
    if (!session) {
      // Open the login modal
      const loginModalButton = document.getElementById("loginPopupModalButton");
      if (loginModalButton) {
        loginModalButton.click(); // Trigger the login modal manually
      }
    }
    // Case 2: If session exists and profilePercentage is less than 80
    else if (session?.user?.profilePercentage < 80) {
      // Show toast error if profile percentage is less than 80
      toast.error("Complete your profile alteast 80% to apply ", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        closeButton: false,
        style: { fontSize: "16px", width: "400px" },
      });
    }
    // Case 3: If session exists and profilePercentage is 80 or greater
    else if (session?.user?.profilePercentage >= 80) {
      // Open the apply job modal
      const applyJobModalButton = document.getElementById(
        "applyJobModalButton"
      );
      if (applyJobModalButton) {
        applyJobModalButton.click(); // Trigger the apply job modal manually
      }
    }
  };
  if (loading)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HashLoader
          color={color}
          loading={loading}
          cssOverride={override}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );

  return (
    <>
      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader2 />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="job-detail-section">
        <div className="upper-box">
          <div className="auto-container">
            <div className="job-block-seven">
              <div className="inner-box">
                <div className="">
                  <span className="company-logo">
                    {/* <Image
                      width={100}
                      height={98}
                      src={company?.logo}
                      alt="logo"
                    /> */}
                  </span>
                  <h4>{job?.jobTitle}</h4>

                  <ul className="job-info">
                    <li>
                      <span className="icon flaticon-briefcase"></span>
                      {getIndustryLabel(job?.industry)}
                    </li>
                    {/* compnay info */}

                    {/* location info */}
                    <li>
                      <span className="icon flaticon-clock-3"></span>{" "}
                      {timeAgo(job?.createdAt)}
                    </li>
                    {/* time info */}
                    {/* <li>
                      <span className="icon flaticon-money"></span> Rs.{" "}
                      {Intl.NumberFormat().format(job?.salary)}/-
                    </li> */}
                    {/* salary info */}
                    <li>
                      <span className="icon flaticon-map-locator"></span>
                      {job?.address?.city}
                      {", "}
                      {getCountryName(job?.address?.country)}
                    </li>
                    <li>
                      <span className="icon flaticon-briefcase"></span>
                      {getJobModeLabel(job?.jobMode)}
                    </li>
                  </ul>
                  {/* End .job-info */}

                  {/* <ul className="job-other-info">
                    {job?.skills?.map((skill, index) => (
                      <li
                        key={index}
                        style={{
                          display: "flex",
                          paddingInline: "20px",
                          backgroundColor: "#DEE8F8",
                          borderRadius: "115px",
                          margin: "5px",
                          color: "#1966D2",
                          fontSize: "14px",
                        }}
                      >
                        {skill}
                      </li>
                    ))}
                  </ul> */}
                  {/* End .job-other-info */}
                </div>
                {/* End .content */}

                {session?.user?.role === "2" || session?.user?.role === "1" ? (
                  <button
                    onClick={() =>
                      downloadExcel(allApplications, job?.jobTitle)
                    }
                    className="theme-btn btn-style-one"
                    style={{ paddingInline: "20px" }}
                  >
                    Download Applications
                  </button>
                ) : (
                  <>
                    {session?.user?.role === "5" && applied === true ? (
                      <>
                        <div className="btn-box d-flex flex-column gap-2">
                          <div
                            style={{
                              width: "170px",
                              height: "42px",
                              backgroundColor: "#A9A9A9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "8px",
                              color: "#404040",
                            }}
                          >
                            <span style={{ marginRight: "10px" }}>
                              <i class="bi bi-pass"></i>
                            </span>
                            Applied
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="btn-box d-flex flex-column gap-2">
                        <a
                          href="#"
                          className="theme-btn btn-style-one"
                          onClick={handleApplyClick}
                        >
                          <span style={{ marginRight: "10px" }}>
                            {" "}
                            <i class="bi bi-pass"></i>
                          </span>

                          {session?.user?.role === "5"
                            ? "Apply Now"
                            : "Submit a profile"}
                        </a>
                        {session?.user?.role === "3" && (
                          <a
                            onClick={handleCopyLink}
                            className="theme-btn btn-style-one"
                          >
                            <span style={{ marginRight: "10px" }}>
                              <i class="bi bi-copy"></i>
                            </span>
                            {copied ? "Copied" : "Copy Link"}
                          </a>
                        )}

                        {/* Hidden buttons to trigger modals manually */}
                        <button
                          type="button"
                          id="loginPopupModalButton"
                          style={{ display: "none" }}
                          data-bs-toggle="modal"
                          data-bs-target="#loginPopupModal"
                        >
                          Trigger Login Modal
                        </button>

                        <button
                          type="button"
                          id="applyJobModalButton"
                          style={{ display: "none" }}
                          data-bs-toggle="modal"
                          data-bs-target="#applyJobModal"
                        >
                          Trigger Apply Job Modal
                        </button>
                      </div>
                    )}
                  </>
                )}
                {/* End apply for job btn */}

                {/* <!-- Modal --> */}
                <div
                  className="modal fade"
                  id="applyJobModal"
                  tabIndex="-1"
                  aria-hidden="true"
                >
                  <div
                    className="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                    style={{
                      maxWidth,
                      display: "flex",
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="apply-modal-content modal-content">
                      <div className="text-center">
                        <h3 className="title">Apply for Job</h3>
                      </div>
                      {/* End modal-header */}
                      {session?.user?.role === "5" ? (
                        <CandidateApplyJobModal currency={job?.currency} />
                      ) : (
                        <ApplyJobModalContent currency={job?.currency} />
                      )}

                      {/* End PrivateMessageBox */}
                    </div>
                    {/* End .send-private-message-wrapper */}
                  </div>
                </div>
                {/* End .modal */}
              </div>
            </div>
            {/* <!-- Job Block --> */}
          </div>
        </div>
        {/* <!-- Upper Box --> */}

        <div className="job-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12 ">
                {/* <h3>Job Description</h3> */}
                {/* <JobDetailsDescriptions /> */}
                {/* End jobdetails content */}

                <div
                  style={{ minHeight: "auto", height: "auto", padding: 0 }}
                  className="ql-editor mt-4"
                  dangerouslySetInnerHTML={{ __html: job?.jobDescription }}
                />
              </div>
              {/* End .content-column */}

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="sidebar-widget">
                    {/* <!-- Job Overview --> */}
                    <h4 className="widget-title">Job Overview</h4>
                    <JobOverView
                      datePosted={timeAgo(job?.createdAt)}
                      expirationDate={convertTimestampToDate(job?.deadline)}
                      location={`${job?.address.city}, ${getStateName(
                        job?.address.country,
                        job?.address.state
                      )}, ${getCountryName(job?.address.country)}`}
                      jobTitle={industryLabel}
                      hours={jobTypeLabel}
                      rate="$15 - $25 / hour"
                      currency={job?.currency}
                      minSalary={job?.minSalary}
                      maxSalary={job?.maxSalary}
                    />

                    <h4 className="widget-title mt-5 ">Required Skills</h4>
                    <div className="widget-content mt-3">
                      <JobSkills skills={job?.skills} />
                    </div>
                    {/* <!-- Job Skills --> */}
                  </div>
                  {/* End .sidebar-widget */}

                  {/* End .company-widget */}
                </aside>
                {/* End .sidebar */}
              </div>

              {session?.user.role === "3" ? (
                <JobsPerCandidate jobId={id} />
              ) : null}

              {session?.user.role === "1" || session?.user.role === "2" ? (
                <RecruitersPerJob jobId={id} />
              ) : null}
            </div>
          </div>
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>
      {/* <!-- End Job Detail Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(JobSingleDynamicV1), {
  ssr: false,
});
