import "./UserHome.css";
import { Link } from "react-router-dom";

export default function UserHome() {
  return (
    <div className="userhome">
    <div className="d-flex justify-content-center align-items-center flex-wrap gap-3 m-auto">
      <Link className="card mx-3 border-black" style={{ width: '18rem' }} to="/useraddtasks">
        <div className="card-body text-center">
          <h5 className="card-title">Add Tasks</h5>
        </div>
      </Link>
      <Link className="card mx-3 border-black" style={{ width: '18rem' }} to="/usermanagetasks">
        <div className="card-body text-center">
          <h5 className="card-title">Manage Tasks</h5>
        </div>
      </Link>
    </div>
    </div>
  );
}
