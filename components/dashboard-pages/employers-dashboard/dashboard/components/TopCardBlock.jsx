const TopCardBlock = ({total}) => {
  return (
    <>
      <div className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div className="ui-item ui-blue">
          <div className="left">
            <i className="icon la flaticon-briefcase"></i>
          </div>
          <div className="right">
            <h4>{total?.totalJobsPosted}</h4>
            <p>Posted Jobs</p>
          </div>
        </div>
      </div>
      
      <div className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div className="ui-item ui-red">
          <div className="left">
            <i className="icon la la-file-invoice"></i>
          </div>
          <div className="right">
            <h4>{total?.totalApplicationCount}</h4>
            <p>Application</p>
          </div>
        </div>
      </div>

      <div className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div className="ui-item ui-yellow">
          <div className="left">
            <i className="icon la la-user-tie"></i>
          </div>
          <div className="right">
            <h4>{total?.recruitersCountRole3}</h4>
            <p> Recruiters</p>
          </div>
        </div>
      </div>

      <div className="ui-block col-xl-3 col-lg-6 col-md-6 col-sm-12">
        <div className="ui-item ui-green">
          <div className="left">
            <i className="icon la la-bookmark-o"></i>
          </div>
          <div className="right">
            <h4>{total?.hiredApplications}</h4>
            <p>Hired Candidates</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopCardBlock;
