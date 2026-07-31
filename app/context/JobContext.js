
// "use client";
// import { createContext, useContext, useState, useEffect } from "react";

// const JobContext = createContext();

// export const JobProvider = ({ children }) => {
//   const [jobList, setJobList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentLength, setCurrentLength] = useState();

//   const [filters, setFilters] = useState({
//     jobType: "",
//     experience: "",
//     industry: "",
//     salary: "",
//   });
//   const [searchQuery, setSearchQuery] = useState("");

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalJobs, setTotalJobs] = useState(0);
//   const jobsPerPage = 50; // Must match backend

//   // Fetch jobs when filters, search query, or page changes
//   useEffect(() => {
//     fetchJobs();
//   }, [filters, searchQuery, currentPage]);

//   const fetchJobs = async () => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams({
//         ...filters,
//         searchQuery,
//         page: currentPage, // Send current page to backend
//         limit: jobsPerPage, // Match backend limit
//       });

//       const response = await fetch(
//         `/api/jobs/get-filtered-jobs?${queryParams.toString()}`
//       );
//       const data = await response.json();

//       if (response.ok) {
//         setJobList(data.jobs || []);
//         setTotalJobs(data.totalJobs || 0); // Set total jobs correctly
//         setCurrentLength(data?.jobs?.length)
//       } else {
//         console.error("Error fetching jobs:", data.error);
//       }
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Pagination controls
//   const totalPages = Math.ceil(totalJobs / jobsPerPage);

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prev) => prev + 1);
//       const element = document.getElementById('top-result');
//       if (element) {
//         element.scrollIntoView({ behavior: 'smooth' }); // Scroll to the section with id "sss"
//       }
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//       const element = document.getElementById('top-result');
//       if (element) {
//         element.scrollIntoView({ behavior: 'smooth' }); // Scroll to the section with id "sss"
//       }
//     }
//   };

//   return (
//     <JobContext.Provider
//       value={{
//         jobList,
//         loading,
//         filters,
//         setFilters,
//         searchQuery,
//         setSearchQuery,
//         totalJobs,
//         fetchJobs,
//         currentPage,
//         setCurrentPage,
//         currentLength,
//         nextPage,
//         prevPage,
//         totalPages,
//       }}
//     >
//       {children}
//     </JobContext.Provider>
//   );
// };

// export const useJobContext = () => useContext(JobContext);


"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const searchParams = useSearchParams();

  // 1️⃣ State
  const [jobList, setJobList]       = useState([]);
  const [loading, setLoading]       = useState(false);
  const [currentLength, setCurrentLength] = useState(0);

  const [filters, setFilters] = useState({
    jobType: "",
    experience: "",
    industry: "",
    salary: "",
    city: "",
    category: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [totalJobs, setTotalJobs] = useState(0);
  const jobsPerPage = 50;

  // 2️⃣ Hydrate from URL on mount or when it changes
  useEffect(() => {
    const nextFilters = {
      jobType:    searchParams.get("jobType")    || "",
      experience: searchParams.get("experience") || "",
      industry:   searchParams.get("industry")   || "",
      salary:     searchParams.get("salary")     || "",
      city:       searchParams.get("city")       || "",
      category:   searchParams.get("category")   || "",
    };

    setFilters(nextFilters);
    setSearchQuery(searchParams.get("searchQuery") || "");
    setCurrentPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  // 3️⃣ Fetch whenever filters/search/page change
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        searchQuery,
        page:  currentPage.toString(),
        limit: jobsPerPage.toString(),
      });

      const res  = await fetch(`/api/jobs/get-filtered-jobs?${params}&t=${Date.now()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      setJobList(data.jobs || []);
      setTotalJobs(data.totalJobs || 0);
      setCurrentLength(data.jobs?.length || 0);
    } catch (err) {
      console.error("fetchJobs error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, currentPage]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // 4️⃣ Pagination helpers
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const scrollTop  = () => {
    const el = document.getElementById("top-result");
    el?.scrollIntoView({ behavior: "smooth" });
  };
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
      scrollTop();
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
      scrollTop();
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobList,
        loading,
        filters,
        setFilters,
        searchQuery,
        setSearchQuery,
        totalJobs,
        fetchJobs,
        currentPage,
        setCurrentPage,
        currentLength,
        nextPage,
        prevPage,
        totalPages,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => useContext(JobContext);
