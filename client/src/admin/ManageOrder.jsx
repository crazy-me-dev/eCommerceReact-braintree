import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Layout from "../core/Layout";

import { isAuthenticated } from "../auth";
import { getOrders, getStatusValues, updateStatusValues } from "./apiAdmin";

const ManageOrder = () => {
  const {
    user: { _id: userId },
    token
  } = isAuthenticated();

  const [statusValues, setStatusValues] = useState([]);
  const [values, setValues] = useState({
    orderList: [],
    loading: false,
    error: ""
  });

  const { orderList, error, loading } = values;

  const loadOrders = async () => {
    const data = await getOrders(userId, token);
    if (data.error) {
      setValues({ ...values, error: data.error });
    } else {
      setValues({ ...values, orderList: data });
    }
  };

  const loadStatusValues = async () => {
    let statusValuesFromDB = await getStatusValues(userId, token);
    if (statusValuesFromDB.error) {
      setValues({ ...values, error: statusValuesFromDB.error });
    } else {
      setStatusValues(statusValuesFromDB);
    }
  };

  useEffect(() => {
    loadOrders();
    loadStatusValues();
  }, []);

  const handleChange = async (e, _id) => {
    const response = await updateStatusValues(userId, token, _id, e.target.value);
    if (response.error) {
      setValues({ ...values, error: response.error });
    } else {
      loadOrders();
    }
  };

  const showOrders = () => {
    let tableItems = orderList.map(
      ({ status, _id, amount, address, createdAt, updatedAt, user }) => (
        <tr key={_id}>
          <td>
            <Link to={`/admin/order/${_id}`}>{_id && _id}</Link>
          </td>
          <td>
            <select name="status" className="" value={status} onChange={e => handleChange(e, _id)}>
              {statusValues &&
                statusValues.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
            </select>
          </td>
          <td>{user && user.name}</td>
          <td>${amount && amount.toFixed(2)}</td>
          <td width="25%">{address && address.substring(0, 25)}...</td>
          <td>{createdAt && moment(createdAt).format("ll")}</td>
          <td>{updatedAt && moment(updatedAt).format("ll")}</td>
        </tr>
      )
    );

    return (
      <table className="ui stackable celled single line table">
        <thead>
          <tr>
            <th>Order Id</th>
            <th>Status</th>
            <th>Customer</th>
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

  return (
    <Layout title="Orders" description={`Order management`} className="container">
      <Link to="/admin/dashboard" className="btn btn-warning mb-3 ">
        Back to Dashboard
      </Link>

      <div className="card mb-5">
        <div className="card-header">
          <h3 className="card-title">Purchase History ({orderList.length} Items)</h3>
        </div>

        <div className="card-body">{showOrders()}</div>
      </div>
    </Layout>
  );
};

export default ManageOrder;
