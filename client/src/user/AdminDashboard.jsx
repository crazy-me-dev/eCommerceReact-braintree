import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { List } from "semantic-ui-react";

/**custom imports */
import Layout from "../core/Layout";
import DashboardLayout from "./DashboardLayout";
import { isAuthenticated } from "../auth";
import { colorPrimaryLight2 } from "../utils/variables";

/**
 * Styling elements with styled-components
 * Semantic UI modified elements' name will end with 'UI'
 */

const ListItemUI = styled(List.Item)`
  padding: 1.5rem 1.2rem !important;
  :hover {
    background-color: ${colorPrimaryLight2}!important;
    color: inherit;
  }

  :active {
    background-color: rgba(255, 255, 255, 0.15) !important;
    color: inherit;
  }
`;

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
      <List divided style={{ fontSize: "1.5rem", color: "F8F8F9", margin: "1rem" }}>
        <ListItemUI>
          <List.Icon size="large" color="green" name="home" />
          <List.Content>
            <Link to="/admin/dashboard">
              <p>Dashboard</p>
            </Link>
          </List.Content>
        </ListItemUI>
        <ListItemUI>
          <List.Icon size="large" color="blue" name="truck" />
          <List.Content>
            <p>
              <Link to="/admin/order">Orders</Link>
            </p>
          </List.Content>
        </ListItemUI>
        <ListItemUI>
          <List.Icon size="large" color="blue" name="target" />
          <List.Content>
            <p>
              <Link to="/admin/category">Categories</Link>
            </p>
          </List.Content>
        </ListItemUI>
        <ListItemUI>
          <List.Icon size="large" color="blue" name="shop" />
          <List.Content>
            <p>
              <Link to="/admin/product">Products</Link>
            </p>
          </List.Content>
        </ListItemUI>

        <ListItemUI>
          <List.Icon size="large" color="blue" name="chart line" />
          <List.Content>
            <Link to="/admin/sales">
              <p>Sales</p>
            </Link>
          </List.Content>
        </ListItemUI>
      </List>
    );
  };

  return (
    <Layout title="Admin Dashboard" description={`G'day ${name}`} isDashboard={true}>
      <DashboardLayout>{adminInfo()}</DashboardLayout>
    </Layout>
  );
};
export default AdminDashboard;
