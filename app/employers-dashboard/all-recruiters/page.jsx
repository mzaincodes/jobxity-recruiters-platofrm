import dynamic from "next/dynamic";
import AllRecruiters from "@/components/dashboard-pages/employers-dashboard/all-recruiters";

export const metadata = {
  title: "Resume Alerts || Superio - Job Borad React NextJS Template",
  description: "Superio - Job Borad React NextJS Template",
};

const index = () => {
  return (
    <>
      <AllRecruiters />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
