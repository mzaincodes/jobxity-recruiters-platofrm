// return (
//   <nav className="ls-pagination">
//     <ul>
//       <li className="prev">
//         <span onClick={prevPage}>
//           <i className="fa fa-arrow-left"></i>
//         </span>
//       </li>
//       {renderPaginationItems()}
//       <li className="next">
//         <span onClick={handleNextClick}>
//           <i className="fa fa-arrow-right"></i>
//         </span>
//       </li>
//     </ul>
//   </nav>

import { useJobContext } from "@/app/context/JobContext";

const Pagination = () => {
  const { currentPage, totalPages, nextPage, prevPage } = useJobContext();
  const navigateToSection = () => {
    const element = document.getElementById('top-result');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' }); // Scroll to the section with id "sss"
    }
  };

  return (
    <div className=" d-flex justify-content-center align-items-center gap-5 ">
      <button
        onClick={prevPage}
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
        onClick={nextPage}
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
  );
};

export default Pagination;
