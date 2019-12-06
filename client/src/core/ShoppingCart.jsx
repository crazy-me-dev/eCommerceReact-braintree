import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import CheckoutCard from "./CheckoutCard";
import { getCartItems } from "./cartHelper";

const ShoppingCart = () => {
  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);

  useEffect(() => {
    setItems(getCartItems());
  }, [run]);

  const showCartItems = () => {
    return items.map(product => (
      <CheckoutCard run={run} setRun={setRun} key={product._id} product={product} />
    ));
  };

  const calculateTotal = () => {
    if (items.length > 0) {
      const total = items.reduce((sum, item) => {
        let subtotal = parseFloat(item.price) * parseInt(item.count);
        console.log(subtotal);

        sum += subtotal;
        return sum;
      }, 0);

      return total;
    }
  };

  const formatPrice = (priceToFormat = 0) => {
    let newPrice = priceToFormat.toFixed(2).toString();
    let decimalPart = newPrice.substring(newPrice.indexOf("."));
    newPrice = newPrice.substring(0, newPrice.indexOf("."));
    return (
      <span>
        {newPrice}
        <sup className="decimal">{decimalPart}</sup>
      </span>
    );
  };

  const showTotalSection = () => {
    return (
      <div>
        <h5>Total:</h5>
        <h1 className="font-weight-bold">AU${formatPrice(calculateTotal())}</h1>
        <h5 className="text-light text-muted old-price">
          AU${formatPrice(calculateTotal() * 2.4)}
        </h5>
        <button className="btn btn-danger btn-lg btn-block mt-3">Checkout</button>
        <div className="input-group mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter Coupon"
            aria-label=""
            aria-describedby="basic-addon1"
          />
          <div className="input-group-append mb-4">
            <button className="btn btn-danger" type="button">
              Apply
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout
      title="Shopping Cart"
      description="All your item can be managed here"
      className="container"
    >
      <div className="row">
        <div className="col-lg-9 col-md-12 ">{showCartItems()}</div>
        <div className="col-lg-3 col-md-12 order-first  order-lg-2 ">{showTotalSection()}</div>
      </div>
      {/* <div className="row">
        <div className=" col-lg-9 col-md-12">
          <div className="card card-body h-100 bg-warning">last on mobile</div>
        </div>
        <div className="col-lg-3 col-md-12 order-first  order-lg-2 ">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-body">1</div>
            </div>
            <div className="col-md-12">
              <div className="card card-body">2</div>
            </div>
          </div>
        </div>
      </div> */}
    </Layout>
  );
};

export default ShoppingCart;
