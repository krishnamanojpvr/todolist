import "./Home.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [user, setUser] = useState();
  const [login, setLogin] = useState(false);
  const [subscriberId, setSubscriberId] = useState();
  const location = useLocation();
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
          
        } catch (err) {
          setLogin(false);
        }
      } catch (err) {
        setLogin(false);
      }
    };

    checkLoginStatus();
  }, [location]);

  return (
    <div className="home d-flex justify-content-center align-items-start text-center">
      <div className="card mx-3 border-black m-5" style={{ width: '18rem' }}>
      <div className="card-body text-center m-3">
          <h5 className="card-title fw-bold">To Do List Application</h5>
        </div>
        
      </div>
    </div>
  );
}
