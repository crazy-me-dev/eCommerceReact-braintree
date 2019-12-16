import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import PaymentCard from "./PaymentCard";
import Layout from "./Layout";
import { getCartItems, emptyCart, getAddress } from "./cartHelper";
import { isAuthenticated } from "../auth";
import { getBraintreeClientToken, processPayment, createOrder } from "./apiCore";
import DropIn from "braintree-web-drop-in-react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { termsOfService } from "./staticContent";
import { ReactComponent as LogoSuccess } from "../../src/images/svgs/checked.svg";

const Checkout = props => {
  const [items, setItems] = useState([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {},
    address: ""
  });

  const {
    user: { _id: userId },
    token
  } = isAuthenticated();

  useEffect(() => {
    let cartItems = getCartItems();
    if (cartItems && cartItems.length <= 0) {
      setRedirect(true);
    }

    if (!getAddress() && isAddressRequired(cartItems)) {
      props.history.push("/cart");
      setRedirect(true);
    }
    setItems(cartItems);
    getToken(userId, token);
  }, []);

  const isAddressRequired = items => {
    return items.reduce((needShipping, item) => {
      if (item.shipping) needShipping = true;
      return needShipping;
    }, false);
  };

  const shouldRedirect = () => {
    if (redirect) return <Redirect to="/cart"></Redirect>;
  };

  const getToken = async (userId, token) => {
    const brainTreeToken = await getBraintreeClientToken(userId, token);
    if (brainTreeToken.error) {
      setData({ ...data, error: brainTreeToken.error });
    } else {
      setData({ ...data, clientToken: brainTreeToken.clientToken });
    }
  };

  const showCartItems = () => {
    return items.map(product => <PaymentCard key={product._id} product={product} />);
  };

  /**
   * this method removes unnecesary/unrelevant values from the items array
   */
  const filterItems = items => {
    return items.reduce((filteredItems, item) => {
      const { hasPhoto, shipping, category, ...product } = item;
      filteredItems.push(product);
      return filteredItems;
    }, []);
  };

  //could go in cartHelper
  const calculateTotal = () => {
    if (items.length > 0) {
      const total = items.reduce((sum, item) => {
        let subtotal = parseFloat(item.price) * parseInt(item.count);
        sum += subtotal;
        return sum;
      }, 0);

      return total.toFixed(2);
    }
  };

  const buildAddress = ({ street, city, state, zip, country }) => {
    return `${street} ${city} ${state} ${zip} ${country}`;
  };

  const buy = async () => {
    try {
      let res = await data.instance.requestPaymentMethod();
      let nonce = res.nonce;
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: calculateTotal()
      };
      res = await processPayment(userId, token, paymentData);

      if (res.error) {
        setData({ ...data, error: res.error });
        return;
      } else {
        let paymentType = "Other";

        if (res.transaction.creditCard.bin) {
          paymentType = res.transaction.creditCard.cardType;
        } else if (res.transaction.paypal.authorizationId) {
          paymentType = "paypal";
        }
        let savedAddress = getAddress();
        if (savedAddress) {
          var { _id, ...address } = savedAddress;
          address = buildAddress(address);
        } else address = null;

        let createOrderData = {
          products: filterItems(items),
          transaction_id: res.transaction.id,
          paymentType,
          amount: res.transaction.amount,
          address: address
        };

        const order = await createOrder(createOrderData, userId, token);
        if (order.error) {
          setData({ ...data, error: order.error });
        } else {
          setData({ ...data, success: res.success });
          emptyCart(setData({ ...data, success: res.success }));
        }
      }
    } catch (e) {
      setData({ ...data, error: e.message });
    }
  };

  const calculateTotalBeforeDiscount = () => {
    const total = calculateTotal() * 2.4;
    return total.toFixed(2);
  };
  const calculateDiscount = () => {
    const total = calculateTotalBeforeDiscount() - calculateTotal();
    return total.toFixed(2);
  };

  const showError = () => (
    <div className="alert alert-danger p-3" style={{ display: data.error ? "" : "none" }}>
      {data.error}
    </div>
  );

  const showSuccess = () => (
    <div className="container text-center mt-5">
      <LogoSuccess className="success-payment" />
      <h1 className="text-info mt-5 ">Thanks! Your payment was successful!</h1>
      <Link to="shop" className="btn btn-outline-info mt-5">
        Continue Shopping
      </Link>
    </div>
  );

  const showTotalSection = () => {
    return (
      <div className="card mt-4">
        <div className="card-body">
          <table className="table table-borderless">
            <tbody>
              <tr className=" text-nowrap">
                <td align="left">
                  <h5 className=" text-nowrap">Original price:</h5>
                </td>
                <td align="right">
                  <h5 className="text-nowrap">AU${calculateTotalBeforeDiscount()}</h5>
                </td>
              </tr>
              <tr className=" text-nowrap">
                <td align="left">
                  <h5 className=" text-nowrap">Coupon discounts:</h5>
                </td>
                <td align="right">
                  <h5 className=" text-nowrap">-AU${calculateDiscount()}</h5>
                </td>
              </tr>
              <tr>
                <td align="left">
                  <h5 className="font-weight-bold text-nowrap">Total:</h5>
                </td>
                <td align="right">
                  {" "}
                  <h5 className="font-weight-bold text-nowrap">AU${calculateTotal()}</h5>
                </td>
              </tr>
            </tbody>
          </table>

          <button type="button" onClick={buy} className="btn btn-danger btn-lg btn-block mt-3">
            Complete Payment
          </button>
        </div>
      </div>
    );
  };

  const showDropIn = () => {
    return data.clientToken ? (
      <div onBlur={() => setData({ ...data, error: "" })}>
        <DropIn
          options={{
            authorization: data.clientToken,
            paypal: { flow: "vault" }
          }}
          onInstance={instance => (data.instance = instance)}
        />
      </div>
    ) : null;
  };

  const showTerms = () => {
    return (
      <div className="card terms text-center bg-light p-3">
        <span>
          By completing your purchase you agree of these
          <button className="btn btn-link text-info " onClick={() => setShowTermsModal(true)}>
            Terms of service
          </button>
        </span>
      </div>
    );
  };

  const showPaymentSection = () => (
    <div>
      <h3 className=" font-weight-bold">Checkout</h3>
      {showError()}
      {showDropIn()}
      {showTerms()}
      <TermsModal show={showTermsModal} onHide={() => setShowTermsModal(false)} />
    </div>
  );

  const TermsModal = props => {
    return (
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Terms of Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container
            className=" mt-3 text-justify pr-5 pl-5"
            style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}
          >
            {termsOfService}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowTermsModal(false)}>Got it!</Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <Layout title="Checkout" description="All payments are 100% secure" className="container">
      {shouldRedirect()}
      <div className="row">
        {data && data.success ? (
          showSuccess()
        ) : (
          <>
            <div className="col-xl-8 col-lg-7 mb-5">{showPaymentSection()}</div>
            <div className="col-xl-4 col-lg-5 mb-5">{showTotalSection()}</div>
            <div className="col-xl-8 col-lg-7">
              <h3 className="mb-5 font-weight-bold">Order summary</h3>
              {showCartItems()}
            </div>{" "}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Checkout;
