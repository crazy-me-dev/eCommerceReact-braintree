import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";

const Signup = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false
  });

  const { name, email, password } = values;

  const handleChange = event => {
    setValues({
      ...values,
      error: false,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = event => {
    event.preventDefault();
    signup({ name, email, password }).then(data => {
      if (data) {
        console.log("bloddy errors");
      } else console.log("no errors");
      // if (data.response) {
      //   console.log("bloddy errros");
      // } else console.log("no errors");
    });

    // console.log(data);

    // if (data.error) {
    //   console.log("data.error");
    // } else console.log("no errors");
  };

  const signup = user => {
    return axios
      .post("/api/signup", user)
      .then(response => {
        return response.json();
      })
      .catch(e => {
        // console.log(error);
        const error = { error: e.response };
        return error;
      });

    // return fetch(`api/signup`, {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(user)
    // })
    //   .then(response => {
    //     return response.json();
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  };
  const form = () => {
    return (
      <div className="card bg-light">
        <article className="card-body mx-auto" style={{ maxWidth: 400 }}>
          <h4 className="card-title mt-3 text-center">Create Account</h4>
          <p className="text-center">Get started with your free account</p>
          <form>
            <div className="form-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  {" "}
                  <i className="fa fa-user"></i>{" "}
                </span>
              </div>
              <input
                className="form-control"
                placeholder="Full name"
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
              />
            </div>
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
                Create Account{" "}
              </button>
            </div>
            <p className="text-center">
              Have an account? <Link to="/signin">Sign In</Link>{" "}
            </p>
          </form>
        </article>
      </div>
    );
  };
  return (
    <Layout
      title="Signup Page"
      description="Node React E-commerce App"
      className="container"
    >
      {form()}
      {JSON.stringify(values)}
    </Layout>
  );
};

export default Signup;
