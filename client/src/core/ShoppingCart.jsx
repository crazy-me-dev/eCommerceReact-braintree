import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import CheckoutCard from "./CheckoutCard";
import { getCartItems, addAddress, getAddress } from "./cartHelper";
import { isAuthenticated, updateUserAddress } from "../auth";

const ShoppingCart = props => {
  const {
    user: { _id: userId },
    token
  } = isAuthenticated();

  const [items, setItems] = useState([]);
  const [run, setRun] = useState(false);
  const [hasAddress, sethasAddress] = useState(false);
  const [address, setAddress] = useState({
    error: false,
    street: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  });

  useEffect(() => {
    setItems(getCartItems());

    //this section acn go in another useEffect
    const storedAddress = getAddress();
    if (storedAddress) {
      setAddress({ ...address, ...storedAddress, error: false });
      sethasAddress(true);
    } else setAddress({ ...address, error: false });
  }, [run]);

  //could go in cartHelper
  const calculateTotal = () => {
    if (items.length > 0) {
      const total = items.reduce((sum, item) => {
        let subtotal = parseFloat(item.price) * parseInt(item.count);
        sum += subtotal;
        return sum;
      }, 0);
      return total;
    }
  };

  const isAddressRequired = () => {
    return items.reduce((needShipping, item) => {
      if (item.shipping) needShipping = true;
      return needShipping;
    }, false);
  };

  const validateForm = () => {
    return address.street && address.city && address.state && address.zip && address.country;
  };

  const handleSubmit = async () => {
    if (!isAddressRequired() || hasAddress) {
      props.history.push("/payment");
      return;
    }
    if (validateForm()) {
      //save address to back end
      const { error, ...newAddress } = address;
      //handle errors here
      const newUser = await updateUserAddress(newAddress, userId, token);
      const { updatedAt, createdAt, ...newSavedAddress } = newUser.address;
      addAddress(newSavedAddress, props.history.push("/payment"));
    } else {
      setAddress({ ...address, error: true });
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

  const showCartItems = () => {
    return items.map(product => (
      <CheckoutCard run={run} setRun={setRun} key={product._id} product={product} />
    ));
  };

  const showError = () => (
    <div className="alert alert-danger p-3" style={{ display: address.error ? "" : "none" }}>
      Please Enter a valid address
    </div>
  );
  const showEmptyCartMessage = () => (
    <div className="alert alert-info p-3" style={{ display: items.length <= 0 ? "" : "none" }}>
      <h1>Your cart is empty</h1>
      <Link to="/shop">Click here to continue shopping</Link>
    </div>
  );

  const handleChange = event => {
    setAddress({ ...address, error: false, [event.target.name]: event.target.value });
  };

  const buildAddress = ({ street, city, state, zip, country }) => {
    return <p>{`${street} ${city} ${state} ${zip} ${country}`}</p>;
  };

  const addressForm = () => (
    <div className="mt-4">
      <div className="col">
        <div className="form-group">
          <input
            type="text"
            name="street"
            value={address.street}
            placeholder="Enter street"
            className="form-control"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="col">
        <div className="form-group">
          <input
            type="text"
            name="city"
            value={address.city}
            placeholder="Enter City"
            className="form-control"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="col">
        <div className="form-group">
          <input
            type="text"
            name="state"
            value={address.state}
            placeholder="Enter state"
            className="form-control"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="col">
        <div className="form-group">
          <input
            type="text"
            name="zip"
            value={address.zip}
            placeholder="Enter ZIP/Post code"
            className="form-control"
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="col">
        <div className="form-group">
          <input
            type="text"
            name="country"
            value={address.country}
            placeholder="Enter country"
            className="form-control"
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );

  const showAddressSection = () => (
    <>
      <h4 className="mb-4">Delivery Address:</h4>
      {hasAddress ? buildAddress(address) : addressForm()}
      <button
        style={{ display: hasAddress ? "" : "none" }}
        className="btn btn-outline-primary btn-lg btn-block mt-3"
        onClick={() => sethasAddress(false)}
      >
        Change Address
      </button>
    </>
  );

  const showSideSection = () => (
    <>
      {" "}
      {showTotalSection()}
      {showError()}
      {isAddressRequired() && showAddressSection()}
    </>
  );

  const showLoginButton = () => (
    <Link to="/signin" className="btn btn-warning btn-lg btn-block mt-3">
      Sign In to Proceed
    </Link>
  );

  const showTotalSection = () => {
    return (
      <div>
        <h5>Total:</h5>
        <h1 className="font-weight-bold">AU${formatPrice(calculateTotal())}</h1>
        <h5 className="text-light text-muted old-price">
          AU${formatPrice(calculateTotal() * 2.4)}
        </h5>

        <button
          onClick={handleSubmit}
          type="button"
          className="btn btn-danger btn-lg btn-block mt-3"
        >
          Checkout
        </button>
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
    <Layout title="Shopping Cart" description="Manage all your items here!" className="container">
      {items.length <= 0 ? (
        showEmptyCartMessage()
      ) : (
        <div className="row">
          <div className="col-lg-9 col-md-12 ">{showCartItems()}</div>
          <div className="col-lg-3 col-md-12 order-first  order-lg-2 ">
            {isAuthenticated() ? showSideSection() : showLoginButton()}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ShoppingCart;
