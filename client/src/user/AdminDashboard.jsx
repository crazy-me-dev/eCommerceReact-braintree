import React from "react";
import { Link } from "react-router-dom";

import Layout from "../core/Layout";

import { isAuthenticated } from "../auth";

const AdminDashboard = () => {
  const {
    user: { name, role, email }
  } = isAuthenticated();

  const adminInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">User Information</h3>
        <ul className="list-group">
          <li className="list-group-item">{name}</li>
          <li className="list-group-item">{email}</li>
          <li className="list-group-item">{role === 1 ? "Admin" : "Registered User"}</li>
        </ul>
      </div>
    );
  };

  const adminLinks = () => {
    return (
      <div className="card">
        <h3 className="card-header">Admin Links</h3>
        <ul className="list-group">
          <li className="list-group-item">
            <Link className="nav-link" to="/create/category">
              Create Category
            </Link>
          </li>
          <li className="list-group-item">
            <Link className="nav-link" to="/create/product">
              Create Product
            </Link>
          </li>
        </ul>
      </div>
    );
  };
  return (
    <Layout title="Admin Dashboard" description={`G'day ${name}`} className="container">
      <div className="row">
        <div className="col col-xl-4  col-lg-3  col-sm-6 mb-3">{adminLinks()}</div>
        <div className="col"> {adminInfo()}</div>
      </div>
    </Layout>
  );
};
export default AdminDashboard;
