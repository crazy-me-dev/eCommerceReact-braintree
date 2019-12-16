import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import Layout from "../core/Layout";

import { isAuthenticated } from "../auth";
import { getUser } from "./apiUser";

const UserDashboard = () => {
  const {
    user: { _id: userId, role },
    token
  } = isAuthenticated();

  const [values, setValues] = useState({
    name: "",
    email: "",
    address: {},
    history: [],
    error: false,
    success: false
  });

  const { name, email, address, history, error, success } = values;

  const load = async () => {
    const user = await getUser(userId, token);
    if (user.error) {
      setValues({ ...values, error: user.error });
    } else {
      setValues({ ...values, error: false, success: true, ...user });
    }
  };
  useEffect(() => {
    load();
  }, []);

  const buildAddress = ({ street, city, state, zip, country }) => {
    return `${street} ${city} ${state} ${zip} ${country}`;
  };

  const showOrders = () => {
    let tableItems = history.map(({ status, _id, amount, address, createdAt, updatedAt }) => (
      <tr key={_id}>
        <td>
          <Link to={`/user/history/${_id}`}>{_id && _id}</Link>
        </td>
        <td>{status && status}</td>
        <td>${amount && amount.toFixed(2)}</td>
        <td width="25%">{address && address.substring(0, 25)}...</td>
        <td>{createdAt && moment(createdAt).format("ll")}</td>
        <td>{updatedAt && moment(updatedAt).format("ll")}</td>
      </tr>
    ));

    return (
      <table className="ui stackable celled single line table">
        <thead>
          <tr>
            <th>Order Id</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Delivery Adress</th>
            <th>Created</th>
            <th>Last Update</th>
          </tr>
        </thead>
        <tbody>{tableItems}</tbody>
      </table>
    );
  };

  const userInfo = () => {
    return (
      <div className="card mb-5">
        <h3 className="card-header">User Information</h3>
        <ul className="list-group">
          <li className="list-group-item">{name}</li>
          <li className="list-group-item">{email}</li>
          <li className="list-group-item">{buildAddress(address)}</li>
          <li className="list-group-item">{role === 1 ? "Admin" : "Registered User"}</li>
        </ul>
      </div>
    );
  };

  const purchaseHistory = () => {
    return (
      <div className="card mb-5">
        <div className="card-header">
          <h3 className="card-title">Purchase History ({history.length} Items)</h3>
        </div>

        <div className="card-body">{showOrders()}</div>
      </div>
    );
  };

  return (
    <Layout title={`User Dashboard`} description={`G'day ${name}`} className="container">
      <div className="row">
        <div className="container-fluid mb-5">
          <Link className="btn btn-outline-primary mr-4" to={`/profile/${userId}`}>
            Update Profile
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col">{userInfo()}</div>
      </div>
      <div className="row">
        <div className="col"> {purchaseHistory()}</div>
      </div>
    </Layout>
  );
};
export default UserDashboard;
