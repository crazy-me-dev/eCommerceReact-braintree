import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";
import { API_URL } from "../keys";
const Signin = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false
  });

  const handleChange = event => {
    setValues({
      ...values,
      error: false,
      [event.target.name]: event.target.value
    });
  };

  const form = () => {
    return (
      <div className="card bg-light">
        <article className="card-body mx-auto" style={{ maxWidth: 400 }}>
          <h4 className="card-title mt-3 text-center">Sign in</h4>

          <form>
            <div className="form-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-envelope"></i>{" "}
                </span>
              </div>
              <input
                className="form-control"
                placeholder="Email address"
                type="email"
                name="email"
                onChange={event => handleChange(event)}
              />
            </div>

            <div className="form-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-lock"></i>{" "}
                </span>
              </div>
              <input
                className="form-control"
                placeholder="Create password"
                type="password"
                name="password"
                onChange={event => handleChange(event)}
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                {" "}
                Sign in{" "}
              </button>
            </div>
            <p className="text-center">
              Don't have an account? <Link to="/signup">Sign Up</Link>{" "}
            </p>
          </form>
        </article>
      </div>
    );
  };

  return (
    <Layout
      title="Signin Page"
      description="Node React E-commerce App"
      className=" offset-2 container"
    >
      {form()}
    </Layout>
  );
};

export default Signin;
