import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Layout from "../core/Layout";

import { isAuthenticated } from "../auth";
import { getUser, updateUser, updateUserLocalStorage, getHistory } from "./apiUser";

const Profile = props => {
  // const { token, _id: userId } = isAuthenticated();

  const {
    user: { _id: userId, name: userName },
    token
  } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    email: "",
    address: {
      street: "",
      city: "",
      zip: "",
      country: "",
      state: ""
    },
    password: "",
    error: false,
    success: false
  });

  const { name, email, address, password, error, success } = values;

  const { street, city, zip, state, country } = address;

  const load = async () => {
    const his = await getHistory(userId, token);
    console.log(his);

    const user = await getUser(props.match.params.userId, token);
    if (user.error) {
      setValues({ ...values, error: user.error });
    } else {
      setValues({ ...values, error: false, ...user });
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handleChange = event => {
    setValues({ ...values, error: false, [event.target.name]: event.target.value });
  };
  const handleAddressChange = event => {
    let data = { ...address };
    data[event.target.name] = event.target.value;
    setValues({ ...values, error: false, address: data });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setValues({ ...values, error: false });
    let updatedUser = { name, address, password };

    const data = await updateUser(userId, token, updatedUser);

    if (data.error) {
      setValues({ ...values, error: data.error, success: false });
    } else {
      updateUserLocalStorage(data, setValues({ ...values, success: true, ...data }));
    }
  };
  const goBack = () => (
    <div className=" mt-5">
      <Link to="/user/dashboard" className="text-warning">
        Back to Dashboard &larr;
      </Link>
    </div>
  );

  const showSuccess = () => (
    <div className="alert alert-info" style={{ display: success ? "" : "none" }}>
      Your Account has been Updated
    </div>
  );
  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
      {error}
    </div>
  );

  const signupForm = () => {
    return (
      <div className="container col-sm-6">
        <article className="card bg-light">
          <form className="card-body mx-auto">
            <h1 className="card-title mt-3 mb-5 text-center">Update your Account</h1>

            {showError()}
            {showSuccess()}
            <div className="form-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">Name</span>
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
                <span className="input-group-text">Email</span>
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
                <span className="input-group-text">Password</span>
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
            {/* {addressForm(address)} */}

            {/* <div className="form-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">Street</span>
              </div>
              <input
                className="form-control"
                placeholder="Enter street"
                type="text"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
              />
            </div> */}

            <div className="form-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">Password</span>
              </div>
              <input
                className="form-control"
                placeholder="Create password"
                type="text"
                name="street"
                value={street}
                onChange={handleAddressChange}
              />
            </div>

            <div className="form-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">City</span>
              </div>
              <input
                type="text"
                name="city"
                value={city}
                placeholder="Enter City"
                className="form-control"
                onChange={handleAddressChange}
              />
            </div>

            <div className="form-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">State</span>
              </div>
              <input
                type="text"
                name="state"
                value={state}
                placeholder="Enter state"
                className="form-control"
                onChange={handleAddressChange}
              />
            </div>

            <div className="form-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">ZIP</span>
              </div>
              <input
                type="text"
                name="zip"
                value={zip}
                placeholder="Enter ZIP/Post code"
                className="form-control"
                onChange={handleAddressChange}
              />
            </div>

            <div className="form-group input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">Country</span>
              </div>
              <input
                type="text"
                name="country"
                value={country}
                placeholder="Enter country"
                className="form-control"
                onChange={handleAddressChange}
              />
            </div>

            {/* end */}
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block" onClick={handleSubmit}>
                {" "}
                Update Account{" "}
              </button>
            </div>
          </form>
        </article>
      </div>
    );
  };

  return (
    <Layout title={`${name}, welcome to your  Dashboard`} description=" " className="container">
      {goBack()}
      {signupForm()}
    </Layout>
  );
};
export default Profile;
