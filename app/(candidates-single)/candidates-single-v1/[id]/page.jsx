"use client";
import dynamic from "next/dynamic";
import LoginPopup from "@/components/common/form/login/LoginPopup";
import FooterDefault from "@/components/footer/common-footer";
import MobileMenu from "@/components/header/MobileMenu";
import DefaulHeader2 from "@/components/header/DefaulHeader2";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  convertTimestampToDate,
  getExperienceLabel,
  getNoticePeriodLabel,
} from "@/utils/helping-func";
import { HashLoader } from "react-spinners";
import ApplicationRemarks from "@/components/my-components/ApplicationRemarks";
import Image from "next/image";
import { BASE_URL } from "@/lib/api";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const CandidateSingleDynamicV1 = ({ params }) => {
  const id = params.id;
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#1966d2");
  const { data: session } = useSession();

  useEffect(() => {
    if (!id || id === "favicon.ico") return;
    const fetchJob = async () => {
      setLoading(true);
      try {
        // const baseUrl = "http://localhost:3000";
        // const baseUrl ="https://recruiters.jobxity.com";
        const res = await axios.get(`${BASE_URL}/api/user/candidate/get-candidate-application/${id}`);
        if (res.status === 200) {
          setCandidate(res?.data);
          console.log("ppp", res?.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    fetchJob();
  }, [id]);

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
      <section className="candidate-detail-section">
        <div className="upper-box">
          <div className="auto-container candidate-name">
            <div className="candidate-block-five">
              <div className="inner-box">
                <div className="content">
                  <figure className="image">
                    <Image
                      width={100}
                      height={100}
                      src={candidate?.pic || "/images/user.png"}
                      alt="image"
                    />
                  </figure>
                  <h2>{candidate?.application?.candidate_id?.name}</h2>

                  <ul className="candidate-info">
                    {/* <li className="designation"></li> */}
                    {/* <li>
                      <span className="icon flaticon-map-locator"></span>
                      {candidate?.application?.candidate_id?.location}
                    </li> */}
                  </ul>

                  {/* <ul className="post-tags">
                    {candidate?.tags?.map((val, i) => (
                      <li key={i}>{val}</li>
                    ))}
                  </ul> */}
                </div>

                <div className="btn-box">
                  <a
                    className="theme-btn btn-style-one"
                    href={candidate?.application?.cvLink}
                    download
                    target="_blank" // This makes the link open in a new tab
                  >
                    View CV
                  </a>

                  {/* <button className="bookmark-btn">
                    <i className="flaticon-bookmark"></i>
                  </button> */}
                </div>
              </div>
            </div>
            {/*  <!-- Candidate block Five --> */}
          </div>
        </div>
        {/* <!-- Upper Box --> */}

        <div className="candidate-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-12 col-md-12 col-sm-12">
                <div className="job-detail"></div>
              </div>
              {/* End .content-column */}

              <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                <div
                  className="sidebar-widget  company-widget col-3 md-col-6 "
                  style={{ minWidth: "350px" }}
                >
                  <div className="widget-content ">
                    <h4 className="mb-5">Candidate Details</h4>
                    <ul className="job-overview">
                      {/* <li>
                        <i className="icon icon-user-2"></i>
                        <h5>Preffered Gender:</h5>
                        <span>
                          {candidate?.application?.job_id?.gender === "M"
                            ? "Male"
                            : candidate?.application?.job_id?.gender === "F"
                            ? "Female"
                            : candidate?.application?.job_id?.gender === "A"
                            ? "Any"
                            : "Gender not specified"}
                        </span>
                      </li> */}
                      <li>
                        <i className="icon icon-calendar"></i>
                        <h5>Experience:</h5>
                        <span>
                          {getExperienceLabel(
                            candidate?.application?.candidate_id
                              ?.totalExperience
                          )}{" "}
                        </span>
                      </li>
                      {/* <li>
                        <i className="icon icon-calendar"></i>
                        <h5>Date Posted:</h5>
                        <span>
                          {convertTimestampToDate(
                            candidate?.application?.job_id?.createdAt
                          )}
                        </span>
                      </li> */}
                      <li>
                        <i className="icon icon-salary"></i>
                        <h5>Current Salary:</h5>
                        <span>
                          {" "}
                          Rs{" "}
                          {Intl.NumberFormat().format(
                            candidate?.application?.candidate_id?.currentSalary
                          )}
                          /-
                        </span>
                      </li>
                      <li>
                        <i className="icon icon-salary"></i>
                        <h5>Expected Salary:</h5>
                        <span>
                          {" "}
                          Rs{" "}
                          {Intl.NumberFormat().format(
                            candidate?.application?.candidate_id?.expectedSalary
                          )}
                          /-
                        </span>
                      </li>

                      {candidate?.application?.candidate_id
                        ?.currentCompanyName ? (
                        <li>
                          <i className="icon icon-user-2"></i>
                          <h5>Current Company:</h5>
                          <span>
                            {" "}
                            {
                              candidate?.application?.candidate_id
                                ?.currentCompanyName
                            }
                          </span>
                        </li>
                      ) : null}

                      <li>
                        <i className="icon icon-clock"></i>
                        <h5>Notice Period:</h5>
                        <span>
                          {getNoticePeriodLabel(
                            candidate?.application?.candidate_id?.noticePeriod
                          )}
                        </span>
                      </li>
                      {/* <li>
                        <i className="icon icon-expiry"></i>
                        <h5>Deadline:</h5>
                        <span>
                          {convertTimestampToDate(
                            candidate?.application?.job_id?.deadline
                          )}
                        </span>
                      </li> */}
                      <li>
                        <i className="icon icon-location"></i>
                        <h5>Candidate Location:</h5>
                        <span>{`${candidate?.application?.job_id?.address?.city}, ${candidate?.application?.job_id?.address?.country}`}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  style={{
                    width: "80%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    marginLeft: "50px",
                    marginTop: "50px",
                  }}
                  className="align-items-start justify-content-start"
                >
                  <h4>Remarks</h4>
                  <p>{candidate?.application?.candidate_id?.remarks}</p>

                  {session?.user?.role == 1 || 2 ? (
                    <div className="mt-4 w-100">
                      <h4 className="mb-2">Other Information</h4>
                      <div className="table-responsive">
                        <div className="row mb-3">
                          <div className="col-6 font-weight-bold">
                            Created By Recruiter:
                          </div>
                          <div className="col-6">
                            {
                              candidate?.application?.candidate_id?.createdBy
                                ?.name
                            }
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-6 font-weight-bold">
                            Created on:
                          </div>
                          <div className="col-6">
                            {convertTimestampToDate(
                              candidate?.application?.candidate_id?.createdAt
                            )}
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-6 font-weight-bold">Email:</div>
                          <div className="col-6">
                            {candidate?.application?.candidate_id?.email}
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-6 font-weight-bold">Phone:</div>
                          <div className="col-6">
                            {candidate?.application?.candidate_id?.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              {/* End .sidebar-column */}
            </div>
            <div className="mt-5">
              <ApplicationRemarks
                applicationId={id}
                addedBy={session?.user?.id}
              />
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

export default dynamic(() => Promise.resolve(CandidateSingleDynamicV1), {
  ssr: false,
});
