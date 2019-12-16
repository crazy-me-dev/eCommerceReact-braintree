import React, { useState, useRef, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";
import Layout from "../core/Layout";

import { isAuthenticated } from "../auth";
import { getSingleOrder, getStatusValues, updateStatusValues } from "./apiAdmin";
import moment from "moment";

const OrderDetail = props => {
  const {
    user: { _id: userId, name: userName },
    token
  } = isAuthenticated();

  const lastLocation = useLastLocation();

  const [order, setOrder] = useState({});
  const [statusValues, setStatusValues] = useState([]);
  const [error, setError] = useState(false);

  const {
    _id: orderId,
    status,
    products,
    amount,
    user,
    createdAt,
    updatedAt,
    address,
    transaction_id,
    paymentType
  } = order;

  const loadSingleOrder = async () => {
    const orderId = props.match.params.orderId ? props.match.params.orderId : null;

    let orderFromDB = await getSingleOrder(userId, token, orderId);

    if (orderFromDB.error) {
      setError(orderFromDB.error);
    } else {
      setOrder(orderFromDB);
    }
  };
  const loadStatusValues = async () => {
    let statusValuesFromDB = await getStatusValues(userId, token);
    if (statusValuesFromDB.error) {
      setError(statusValuesFromDB.error);
    } else {
      setStatusValues(statusValuesFromDB);
    }
  };

  useEffect(() => {
    loadSingleOrder();
    loadStatusValues();
  }, []);

  const handleChange = async (e, _id) => {
    const response = await updateStatusValues(userId, token, orderId, e.target.value);
    if (response.error) {
      setError(response.error);
    } else {
      loadSingleOrder();
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
  };

  // const shouldRedirect = () => {
  //   if (redirect) return <Redirect to="/admin/category"></Redirect>;
  // };

  // const showSuccess = () => (
  //   <div className="alert alert-info" style={{ display: success ? "" : "none" }}>
  //     New Category has been created.
  //   </div>
  // );

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
      {error}
    </div>
  );

  if (lastLocation && lastLocation.pathname === "/cart") {
    return <Redirect to="/cart" />;
  }
  const goBack = () => (
    <div className="container mt-5 mb-5">
      <Link
        to={
          lastLocation && lastLocation.pathname === "/user/dashboard"
            ? "/user/dashboard"
            : "/admin/order"
        }
        className="text-warning"
      >
        Back to Dashboard &larr;
      </Link>
    </div>
  );

  const showOrderDetails = () => {
    return (
      <div className="container-fluid">
        <div className="card spur-card ">
          <div className="card-header bg-primary text-white">
            <div className="spur-card-title">
              <h5> Order details</h5>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col">
                <p>
                  <span className="font-weight-bold">Order Id: </span>
                  {orderId}
                </p>
                <p>
                  {" "}
                  <span className="font-weight-bold">Added on: </span>{" "}
                  {createdAt && moment(createdAt).format("lll")}
                </p>
                <p>
                  {" "}
                  <span className="font-weight-bold">Last Update: </span>{" "}
                  {updatedAt && moment(updatedAt).format("lll")}
                </p>
              </div>
              <div className="col">
                <p>
                  {" "}
                  <span className="font-weight-bold">Status: </span>
                  <select
                    name="status"
                    className=""
                    value={status}
                    onChange={e => handleChange(e, orderId)}
                    disabled={
                      lastLocation && lastLocation.pathname === "/user/dashboard" ? true : null
                    }
                  >
                    {statusValues &&
                      statusValues.map((s, i) => (
                        <option key={i} value={s}>
                          {s}
                        </option>
                      ))}
                  </select>
                </p>

                <p>
                  {" "}
                  <span className="font-weight-bold">Delivery Type: </span>
                  {address ? "Home delivery" : "E-delivery"}
                </p>
                <p>
                  {" "}
                  <span className="font-weight-bold">Payment Type: </span>
                  {paymentType}
                </p>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col">
                <p>
                  <span className="font-weight-bold">Customer Name: </span>
                  {user && user.name}
                </p>
                <p>
                  <span className="font-weight-bold">Delivery Address: </span>
                  {address}
                </p>
              </div>
            </div>

            {showProductDetails()}
          </div>
        </div>
      </div>
    );
  };

  const showProductDetails = () => {
    let tableItems =
      products &&
      products.map(({ _id, name, count, price }) => (
        <tr key={_id}>
          <td>{name && name}</td>
          <td>{price && price.toFixed(2)}</td>
          <td>{count & count}</td>
          <td> {price && count && (count * price).toFixed(2)}</td>
        </tr>
      ));

    return (
      <table className="ui stackable  celled  table mt-5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Sub-total</th>
          </tr>
        </thead>
        <tbody>
          {tableItems}
          <tr>
            <td></td>
            <td></td>
            <td>
              <span className="font-weight-bold">Total:</span>
            </td>
            <td>
              {" "}
              <span className="font-weight-bold"> {amount && amount.toFixed(2)}</span>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };
  return (
    <Layout title="Order Details" description={`G'day ${userName}`} className="container">
      <div className="row">
        {goBack()}
        {showError()}
        {showOrderDetails()}
      </div>
    </Layout>
  );
};

export default OrderDetail;
