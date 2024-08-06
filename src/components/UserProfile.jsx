import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css";
import Loader from "./Loader";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://tdlback.vercel.app/api/users/getuser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  return (
    <div className="container mt-5 userprofile">
      <h1 className="mb-4">User Profile</h1>
      {loading && <Loader />}
      {user && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{user.name}</td>
              </tr>
              <tr>
                <th>Username</th>
                <td>{user.username}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{user.gmail}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{user.mobilenumber}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Profile;
