import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gmail, setGmail] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");

  const [error, setError] = useState("");

  const [loader, setLoader] = useState(false);

  const handlePasswordChange = (e) => {
    let value = e.target.value;
    if (value.length < 6) {
      setError("Password must be at least 6 characters long");
    } else {
      setError("");
    }
    setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/register",
        { name, username, password, gmail, mobilenumber }
      );
      console.log(response.data);
      setLoader(true);
      setTimeout(() => {
        setLoader(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.log("Error registering user. Please try again.");
    }
  };

  return (
    <div className="register-container d-flex justify-content-center  min-vh-100">
      <div className="col-12 col-md-6 col-lg-4">
        <form
          onSubmit={handleSubmit}
          className="mt-5 register-form rounded-3 p-4 border border-black"
        >
          <h1 className="text-center mb-4">Register</h1>
          <div
            className="form-floating mb-3 mx-auto"
            style={{ maxWidth: "100%" }}
          >
            <input
              type="text"
              className="form-control border border-black"
              id="floatingName"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="floatingName">Name</label>
          </div>
          <div
            className="form-floating mb-3 mx-auto"
            style={{ maxWidth: "100%" }}
          >
            <input
              type="text"
              className="form-control border border-black"
              id="floatingUsername"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
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
              onChange={handlePasswordChange}
              required
            />
            <label htmlFor="floatingPassword">Password</label>
            {error && <div className="text-danger text-center">{error}</div>}
          </div>
          <div
            className="form-floating mb-3 mx-auto"
            style={{ maxWidth: "100%" }}
          >
            <input
              type="email"
              className="form-control border border-black"
              id="floatingGmail"
              placeholder="Gmail"
              onChange={(e) => setGmail(e.target.value)}
              required
            />
            <label htmlFor="floatingGmail">Gmail</label>
          </div>
          <div
            className="form-floating mb-3 mx-auto"
            style={{ maxWidth: "100%" }}
          >
            <input
              type="number"
              className="form-control border border-black"
              id="floatingPhone"
              placeholder="Phone"
              onChange={(e) => setMobilenumber(e.target.value)}
              required
            />
            <label htmlFor="floatingPhone">Phone</label>
          </div>
          <div className="d-flex justify-content-center">
            {!loader && (
              <button
                type="submit"
                className="btn btn-dark w-100"
              >
                Register
              </button>
            )}
            {loader && <Loader />}
          </div>
        </form>
      </div>
    </div>
  );
}