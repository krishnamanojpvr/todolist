import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useEffect, useState } from "react";
import SuprSendInbox from "@suprsend/react-inbox";
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState();
  const [login, setLogin] = useState(false);
  const [subscriberId, setSubscriberId] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLogin(false);
        return;
      }
      try {
        try {
          const response = await axios.post(
            "http://localhost:4000/api/users/check",
            { token }
          );
          if (response.status === 200) {
            setLogin(true);
          }
          setUser(response.data.name);
          console.log(response);
        } catch (err) {
          setLogin(false);
        }
      } catch (err) {
        setLogin(false);
      }
    };

    checkLoginStatus();
  }, [location]);

  useEffect(() => {
    const generateSubscriberId = async () => {
        if (!login) return;
        try {
            // const subscriberResponse = await axios.post('http://localhost:4000/api/subsid/subsId_generate');
            let username =  localStorage.getItem("username")
            const subscriberResponse = await axios.post('http://localhost:4000/api/subsid/subsId_generate',{distinct_id: username });
            console.log(subscriberResponse);
            setSubscriberId(subscriberResponse.data);
        } catch (err) {
            console.log('Error generating subscriber id:', err);
        }
    };      

    generateSubscriberId();
}, [login, user]);
  
  const handlelogout= async (e) =>{
    e.preventDefault();
    localStorage.removeItem("token");
    setLogin(false);
    navigate('/')
  }

  return (
    <div className="d-flex justify-content-center">
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light shadow rounded m-3"
        style={{ width: "90%", maxWidth: "1200px" }}
      >
        <div className="container-fluid">
          {!login && (<Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src="./task-list.svg"
              alt="logo"
              style={{
                width: "40px",
                height: "40px",
                padding: "0.8px",
              }}
            />
            <span className="fs-5 text-dark fw-semibold ms-2">To Do List</span>
          </Link>)}
          {login && (<Link className="navbar-brand d-flex align-items-center" to="/userhome">
            <img
              src="./task-list.svg"
              alt="logo"
             
              style={{
                width: "40px",
                height: "40px",
                padding: "0.8px",
              }}
            />
            <span className="fs-5 text-dark fw-semibold ms-2">Home</span>
          </Link>)}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {!login && (
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link text-dark" to="/login">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {login && (
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link text-dark fw-bold" to="/userprofile">
                    {user}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-danger fw-bold" onClick={handlelogout}>
                    Logout
                  </Link>
                </li>
                <SuprSendInbox
                  theme={{
                    badge: {
                      backgroundColor: "pink",
                      color: "black",
                      margin: "0px",
                    },
                    bell: { color: "blue" },
                    header: {
                      container: { backgroundColor: "#0099ff" },
                      headertext: { color: "black" },
                      markAllReadText: { color: "black", fontWeight: "bold" },
                    },
                    notification: {
                      actions: {
                        container: { hoverBackgroundColor: "#349beb" },
                      },
                      expiresText: { color: "red" },
                      actionsMenuIcon: { color: "blue" },
                    },
                  }}
                  themeType="light / dark"
                  // workspaceKey={process.env.REACT_APP_SUPRSEND_WORKSPACE_KEY}
                  workspaceKey="YApBQPbxLEjEsdpMC69o"
                  subscriberId={subscriberId}
                  distinctId={localStorage.getItem("username")}
                />
              </ul>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
