import React from "react";
import { Link } from "react-router-dom";

import Layout from "../core/Layout";

import { isAuthenticated } from "../auth";

const UserDashboard = () => {
  const {
    user: { name, role, email }
  } = isAuthenticated();

  const userInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">User Information</h3>
        <ul className="list-group">
          <li className="list-group-item">{name}</li>
          <li className="list-group-item">{email}</li>
          <li className="list-group-item">
            {role === 1 ? "Admin" : "Registered User"}
          </li>
        </ul>
      </div>
    );
  };

  const purchaseHistory = () => {
    return (
      <div className="card mb-5">
        <div className="card-header">
          <h3 className="card-title">Purchase History</h3>
        </div>

        <div className="card-body">
          <ul className="list-group">
            <li className="list-group-item">history</li>
          </ul>
        </div>
      </div>
    );
  };

  const userLinks = () => {
    return (
      <div className="card">
        <h3 className="card-header">User Links</h3>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/cart">
              Cart
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/profile/update">
              Update Profile
            </Link>
          </li>
        </ul>
      </div>
    );
  };
  return (
    <Layout
      title="Dashboard"
      description={`G'day ${name}`}
      className="container-fluid"
    >
      <div className="row">
        <div className="col col-lg-2 mb-5">{userLinks()}</div>
        <div className="col">
          {" "}
          {userInfo()}
          {purchaseHistory()}
        </div>
      </div>
    </Layout>
  );
};
export default UserDashboard;
