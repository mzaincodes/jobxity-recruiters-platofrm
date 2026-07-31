"use client";
import Link from "next/link";
import { formatApplicationId, getStatusLabel, timeAgo } from "@/utils/helping-func";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { BeatLoader, HashLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const WidgetContentBox = () => {
  const [loading, setLoading] = useState(false);
  const [dontReload, setDontReload] = useState(false);
  const [candidateList, setCandidateList] = useState([]);
  const { data: session } = useSession();
  const [color, setColor] = useState("#1966d2");
  const [submitLoadingState, setSubmitLoadingState] = useState({});
  const [refreshCandidates, setRefreshCandidates] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // used only to trigger API

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCandidates, setTotalCandidates] = useState(0);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        if (!dontReload) {
          setLoading(true);
        }
        setDontReload(false);
        const res = await axios.get(
          `/api/user/candidate/get-all-candidates?page=${currentPage}&limit=30&searchQuery=${searchQuery}`
        );
        if (res.status === 200) {
          console.log("wefwef", res)
          setCandidateList(res?.data.applications);
          setTotalCandidates(res?.data.totalCount);
          setTotalPages(Math.ceil(res?.data.totalCount / 30));
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching candidate details:", error);
      }
    };

    fetchCandidates();
  }, [session, refreshCandidates, currentPage, searchQuery]); // ✅ Only refetch when `searchQuery` is submitted

  const handleSearchChange = (e) => {
    setSearchText(e.target.value); // Update searchText as user types
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1); // Reset to page 1 when a search is submitted
    setSearchQuery(searchText); // Trigger the useEffect with new query
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(); // Submit search when Enter is pressed
    }
  };

  const handleSubmit = async (applicationId) => {
    if (!session?.user?.id || !applicationId) {
      return;
    }

    setSubmitLoadingState((prevState) => ({
      ...prevState,
      [applicationId]: true,
    }));

    const data = {
      applicationId,
      updatedBy: session?.user?.id,
    };

    try {
      const response = await axios.post(
        "/api/application/submit-to-client",
        data
      );
      if (response?.status === 200) {
        console.log(response.data.message);
        setRefreshCandidates((prev) => !prev);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    } finally {
      setSubmitLoadingState((prevState) => ({
        ...prevState,
        [applicationId]: false,
      }));
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "50vh",
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

  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="widget-content">
      <div className="widget-title">
        <h4>Showing {totalCandidates} Records</h4>
      </div>
      <div className="job-search-form p-2" id="top-result">
        <div className="row">
          <div className="form-group col-lg-9 col-md-12 col-sm-12">
            <input
              type="text"
              placeholder="Enter candidate name"
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleKeyPress}
            />
            <span className="icon flaticon-search-3"></span>
          </div>

          <div className="form-group col-lg-3 col-md-12 col-sm-12 text-right d-flex align-items-center justify-content-center">
            <button
              type="button"
              style={{ fontSize: "20px", width: "100px", height: "40px" }}
              className="theme-btn btn-style-one"
              onClick={handleSearchSubmit}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="tabs-box">
        <div className="tabs-content">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Candidate Name</th>
                <th className="text-center">Recruiter Name</th>
                <th className="text-center">Job Title</th>
                {/* <th className="text-center">Status</th> */}
                <th className="text-center">Currently Applied For</th>
                {/* <th className="text-center">Submit to client</th> */}
              </tr>
            </thead>

            <tbody>
              {candidateList?.map((item, index) => (
                <tr key={index}>
                  <td>                  
                      <div className="job-block">
                        <div className="inner-box">
                          <h4>{formatApplicationId(item?.appId)}</h4>
                        </div>
                      </div>
                  </td>
                  <td>
                    <Link href={`/candidates-single-v1/${item?.applicationId}`}>
                      <div className="job-block">
                        <div className="inner-box">
                          <h4>{item?.candidateName}</h4>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <Link href={`/candidates-single-v2/${item?.recruiterId}`}>
                    <td className="d-flex justify-content-center">
                      {item?.recruiterName}
                    </td>
                  </Link>
                  <td className="text-center">
                    <Link href={`/job-single-v1/${item?.jobId}`}>
                      {item.jobTitle}
                    </Link>
                  </td>
                  {/* <td className="text-center">
                    {getStatusLabel(item?.status)}
                  </td> */}
                  {/* <td className="text-center">{item?.currentlyApplyingFor}</td> */}
                  {/* <td className="text-center">{timeAgo(item?.updatedAt)}</td> */}
                  {/* <td className="text-center">
                    {item?.status === "0" || item?.status === "1" ? (
                      <button
                        style={{
                          width: "100px",
                          height: "30px",
                          color: "#295F98",
                          backgroundColor: "#C6E7FF",
                          borderRadius: 8,
                        }}
                        onClick={() => {
                          handleSubmit(item?.applicationId);
                          setDontReload(true);
                        }}
                      >
                        {submitLoadingState[item?.applicationId] ? (
                          <BeatLoader
                            color="#fff"
                            loading={submitLoadingState[item?.applicationId]}
                            cssOverride={override}
                            size={6}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                          />
                        ) : (
                          "Submit"
                        )}
                      </button>
                    ) : (
                      <button
                        disabled
                        style={{
                          width: "100px",
                          height: "30px",
                          color: "#1F7D53",
                          backgroundColor: "#E0FBE2",
                          borderRadius: 8,
                        }}
                      >
                        Submitted
                      </button>
                    )}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center align-items-center gap-5 mt-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              style={{
                width: "70px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "#1966D2",
                color: "white",
              }}
            >
              <i className="fa fa-arrow-left"></i>
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              style={{
                width: "70px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "#1966D2",
                color: "white",
              }}
            >
              <i className="fa fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetContentBox;
