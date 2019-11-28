import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

import { signin, authenticate, isAuthenticated } from "../auth";
import Layout from "../core/Layout";

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    redirectToReferral: false
  });

  const { user } = isAuthenticated();

  const { email, password, loading, error, redirectToReferral } = values;

  const handleChange = e => {
    setValues({ ...values, error: false, [e.target.name]: e.target.value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    const data = await signin({ email, password });
    if (data.error) {
      setValues({ ...values, error: data.error, loading: false });
    } else {
      authenticate(data, () => {
        setValues({ ...values, redirectToReferral: true });
      });
    }
  };

  const signinForm = () => {
    return (
      <div className="container col-sm-6">
        <article className="card bg-light">
          <form className="card-body mx-auto">
            <h4 className="card-title mt-3 text-center">Sign in</h4>

            {showError()}
            {showLoading()}
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
                value={email}
                onChange={handleChange}
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
                value={password}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary btn-block"
                onClick={handleSubmit}
              >
                {" "}
                Sign in{" "}
              </button>
            </div>
            <p className="text-center">
              Dont Have an account? <Link to="/signup">Sign Up</Link>{" "}
            </p>
          </form>
        </article>
      </div>
    );
  };

  const showLoading = () =>
    loading && (
      <div className="alert alert-info">
        <h2>Loading...</h2>
      </div>
    );
  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const redirectUser = () => {
    if (redirectToReferral) {
      if (user && user.role === 1) {
        return <Redirect to="/admin/dashboard" />;
      } else {
        return <Redirect to="/user/dashboard" />;
      }
    }
    if (user) return <Redirect to="/" />;
  };

  return (
    <Layout
      title="Signin Page"
      description="Node React E-commerce App"
      className=" offset-2 container"
    >
      {signinForm()}
      {redirectUser()}
    </Layout>
  );
};

export default Signin;
