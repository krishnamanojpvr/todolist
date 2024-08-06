import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Loader from "./Loader.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleUsername = (e) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    setError("");
    try {
      const response = await axios.post(
        "https://tdlback.vercel.app/api/users/login",
        { username, password }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      setLoader(false);
      navigate("/userhome");
    } catch (err) {
      setError("Invalid Credentials");
      setLoader(false);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center min-vh-100">
      <div className="col-12 col-md-6 col-lg-4">
        <form
          className="mt-5 login-form rounded-3 p-4 border border-black"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center mb-4">Login</h1>
          <div
            className="form-floating mb-3 mx-auto"
            style={{ maxWidth: "100%" }}
          >
            <input
              type="text"
              className="form-control border border-black"
              id="floatingUsername"
              placeholder="Username"
              onChange={handleUsername}
              required
            />
            <label htmlFor="floatingUsername">Username</label>
          </div>
          <div
            className="form-floating mb-3 mx-auto"
            style={{ maxWidth: "100%" }}
          >
            <input
              type="password"
              className="form-control border border-black"
              id="floatingPassword"
              placeholder="Password"
              onChange={handlePassword}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          {error && <p className="error-message text-danger text-center">{error}</p>}
          <div className="d-flex justify-content-center">
            {!loader && (
              <button
                type="submit"
                className="btn btn-dark w-100"
              >
                Login
              </button>
            )}
          </div>
        {loader && <Loader />}
        <div className="login-footer text-center mt-3">
          <span>Don't have an account? </span>
          <Link to="/register">Sign Up</Link>
        </div>
        </form>
      </div>
    </div>
  );
}
