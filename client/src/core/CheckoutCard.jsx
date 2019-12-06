import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import ShowImage from "./ShowImage";
import noImage from "../images/no-image.jfif";
import moment from "moment";
import { updateItem, removeItem } from "./cartHelper";

const CheckoutCard = ({ product, setRun = f => f, run = undefined }) => {
  const {
    _id,
    name,
    description,
    price,
    hasPhoto,
    category,
    createdAt,
    count: initialCount,
    quantity
  } = product;

  const [subtotal, setSubtotal] = useState(0);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    calculateSubtotal();
  }, [count]);

  const showImage = className => {
    return (
      <div className={className}>
        <img
          src={hasPhoto ? `/api/product/photo/${_id}` : `${noImage}`}
          alt={name}
          className=""
          style={{ maxHeight: "100%", maxWidth: "100%" }}
        ></img>
      </div>
    );
  };

  const formatPrice = priceToFormat => {
    let newPrice = priceToFormat.toFixed(2).toString();
    let decimalPart = newPrice.substring(newPrice.indexOf("."));
    newPrice = newPrice.substring(0, newPrice.indexOf("."));
    return (
      <span>
        {newPrice}
        <sup>{decimalPart}</sup>
      </span>
    );
  };

  const calculateSubtotal = () => {
    setSubtotal(count * price);
  };

  const handleChange = event => {
    const re = /^[0-9\b]+$/;

    // if value is not blank, then test the regex

    if (re.test(event.target.value)) {
      setRun(!run);
      let countValue;

      if (event.target.value < 1) countValue = 1;
      else if (event.target.value > quantity) countValue = quantity;
      else countValue = parseInt(event.target.value);

      // if(typeof countValue )
      setCount(countValue);

      updateItem(_id, event.target.value);
    }
  };

  const remove = () => {
    removeItem(_id);
    setRun(!run);
  };

  return (
    <div className="card card-size">
      <div className="card-body">
        <div className="row">
          <div className="col-lg-2 col-md-3">
            <div className="row">
              <div className="col-12">{showImage("cart-image")}</div>
            </div>
          </div>
          <div className="col-lg-10 col-md-9">
            <div className="row">
              <div className="col-lg-9">
                <p className="card-text font-weight-bold lead">
                  <Link to={`/product/${_id}`}>{name.substring(0, 100)}</Link>
                </p>
                <p className="card-text  text-justify lead">{category && category.name}</p>
              </div>
              <div className="col-lg-3">
                <div className="row">
                  <div className="col-lg-12 col-md-4 col-sm-5">
                    <h5
                      className="card-text font-weight-bold text-nowrap mt-3"
                      style={{ color: "#f20505" }}
                    >
                      AU$
                      {formatPrice(subtotal)}
                    </h5>
                    <h6 className="card-text text-light text-nowrap text-muted old-price">
                      AU${formatPrice(subtotal * 2.4)}
                    </h6>
                  </div>

                  <div className="col-lg-12 col-md-4 col-sm-5 mt-3">
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">Qty</span>
                      </div>
                      <input
                        type="number"
                        onChange={handleChange}
                        value={count}
                        className="form-control"
                        min="1"
                        max={quantity}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-4 mt-3">
                    <button onClick={remove} type="button" className="btn btn-link text-nowrap">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCard;
