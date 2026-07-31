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
  getBankLabel,
  getCurrencyLabel,
  getEducationLabel,
  getExperienceLabel,
} from "@/utils/helping-func";
import { HashLoader } from "react-spinners";
import Image from "next/image";
import { BASE_URL } from "@/lib/api";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const CandidateSingleDynamicV1 = ({ params }) => {
  const id = params.id;
  const [recruiter, setRecruiter] = useState(null);
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
        const res = await axios.get(`${BASE_URL}/api/user/recruiter/get-recruiter/${id}`);
        if (res.status === 200) {
          setRecruiter(res?.data);
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
                      src={recruiter?.pic}
                      alt="avatar"
                    />
                  </figure>
                  <h2>{recruiter?.name}</h2>

                  <ul className="candidate-info">
                    {recruiter?.gender === "M"
                      ? "Male"
                      : recruiter?.gender === "F"
                      ? "Female"
                      : "Other"}
                  </ul>

          
                </div>

                <div className="btn-box">
                  <div className="theme-btn btn-style-one">
                    {recruiter?.profilePercentage}% Profile Completed
                  </div>
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

              <div className="d-flex flex-column flex-md-row align-items-start justify-content-between">
                <div
                  className="sidebar-widget  company-widget col-3 md-col-6 "
                  style={{ minWidth: "350px" }}
                >
                  <div className="widget-content ">
                    <h4 className="mb-5">Recruiter Details</h4>
                    <ul className="job-overview">
                      <li>
                        <i className="icon icon-user-2"></i>
                        <h5>Email</h5>
                        <span>{recruiter?.email}</span>
                      </li>
                      <li>
                        <i className="icon icon-user-2"></i>
                        <h5>Phone Number</h5>
                        <span>{recruiter?.phone}</span>
                      </li>
                      <li>
                        <i className="icon icon-clock"></i>
                        <h5>Account created on</h5>
                        <span>
                          {convertTimestampToDate(recruiter?.createdAt)}
                        </span>
                      </li>
                      <li>
                        <i className="icon icon-calendar"></i>
                        <h5>Recruiting Experience</h5>
                        <span>
                          {getExperienceLabel(recruiter?.recruitingExperience)}{" "}
                        </span>
                      </li>

                      <li>
                        <i className="icon icon-user-2"></i>
                        <h5>Education:</h5>
                        <span>
                          {getEducationLabel(recruiter?.educationLevel)}
                        </span>
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
                   
                  }}
                  className="align-items-start justify-content-start"
                >
                  <h4>Description</h4>
                  <p>{recruiter?.description}</p>

                  <div className="mt-5 w-100">
                    <h4 className="mb-2">Bank Details</h4>
                    <div className="table-responsive">
                      <div className="row mb-3">
                        <div className="col-6 font-weight-bold">Bank Name</div>
                        <div className="col-6">
                          {recruiter?.bankDetails?.otherBankName ? (
                            <div>{recruiter?.bankDetails?.otherBankName}</div>
                          ) : (
                            <div>
                              {getBankLabel(recruiter?.bankDetails?.bankName)}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-6 font-weight-bold">
                          Account Holder Name
                        </div>
                        <div className="col-6">
                          {recruiter?.bankDetails?.accountHolderName}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-6 font-weight-bold">
                          Account Number
                        </div>
                        <div className="col-6">
                          {recruiter?.bankDetails?.accountNo}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-6 font-weight-bold">
                          Account Currency
                        </div>
                        <div className="col-6">
                          {getCurrencyLabel(recruiter?.bankDetails?.currency)}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-6 font-weight-bold">
                          Swift Code
                        </div>
                        <div className="col-6">
                        {recruiter?.bankDetails?.swiftCode}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 w-100">
                    <h4 className="mb-2">Address</h4>
                    <div className="table-responsive">
                      <div className="row mb-3">
                        <div className="col-6 font-weight-bold">Country</div>
                        <div className="col-6">
                          {recruiter?.address?.country}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-6 font-weight-bold">City</div>
                        <div className="col-6">{recruiter?.address?.city} </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-6 font-weight-bold">
                          State
                        </div>
                        <div className="col-6">
                          {recruiter?.address?.state}{" "}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-6 font-weight-bold">
                          Postal Code
                        </div>
                        <div className="col-6">
                          {recruiter?.address?.postalCode}{" "}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-6 font-weight-bold">
                          Complete Adress
                        </div>
                        <div className="col-6">
                          {recruiter?.address?.completeAddress}{" "}
                        </div>
                      </div>
                    
                    
                    </div>
                  </div>
                </div>
              </div>
              {/* End .sidebar-column */}
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
