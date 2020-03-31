import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import styled from "styled-components";

import {
  Grid,
  Header,
  Container,
  GridColumn,
  Message,
  Button,
  Table,
  Card,
  Icon,
  Modal
} from "semantic-ui-react";

/**Custom imports */
import { EMPTY_CART } from "../store/actions/cartAction";
import CheckoutCard from "./CheckoutCard";
import Layout from "../layout/Layout";
import { getBraintreeClientToken, processPayment, createOrder } from "./apiCore";

import { termsOfService } from "../common/staticContent";
import { ButtonLink } from "../common/components/customComponents";

/**
 * Styling elements with styled-components
 * Semantic UI modified elements' name will end with 'UI'
 */

const Title = styled.p`
  padding-top: 1rem;
  font-size: 1.4rem;
`;



const Checkout = props => {
  const dispatch = useDispatch();

  const { user, token, address: storedAddress, cart: items } = useSelector(state => ({
    ...state.authReducer,
    ...state.cartReducer
  }));
  const userId = user && user._id ? user._id : null;
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

  useEffect(() => {
    if (items && items.length <= 0) {
      setRedirect(true);
    }

    if (!storedAddress && isAddressRequired(items)) {
      props.history.push("/cart");
      setRedirect(true);
    }

    //gets the Braintree token
    getBraintreeToken(userId, token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getBraintreeToken = async (userId, token) => {
    const brainTreeToken = await getBraintreeClientToken(userId, token);
    if (brainTreeToken.error) {
      setData({ ...data, error: brainTreeToken.error });
    } else {
      setData({ ...data, clientToken: brainTreeToken.clientToken });
    }
  };

  const showCartItems = () => {
    return items.map(product => (
      <CheckoutCard key={product._id} product={product} isPayment={true} />
    ));
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

        if (storedAddress) {
          var { _id, ...address } = storedAddress;
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
          dispatch({
            type: EMPTY_CART
          });
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
    <Message size="large" color="red" style={{ display: data.error ? "" : "none" }}>
      {data.error}
    </Message>
  );

  const showSuccess = () => (
    <Container textAlign="center">
      <Header as="h1" color="teal" icon style={{ marginTop: "4rem" }}>
        <Icon
          size="massive"
          name="check circle outline"
          color="teal"
          style={{ marginBottom: "2rem" }}
        />
        Thanks! Your payment was successful!
      </Header>
      <Header.Subheader style={{ marginTop: "2rem" }}>
        <Button color="teal" to="shop" as={Link}>
          Continue Shopping
        </Button>
      </Header.Subheader>
    </Container>
  );

  const showTotalSection = () => {
    return (
      <Card fluid style={{ marginTop: 14 }}>
        <Card.Content>
          <Table basic="very" unstackable>
            <Table.Body>
              <Table.Row>
                <Table.Cell textAlign="left">
                  <Title>Original price:</Title>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Title>AU${calculateTotalBeforeDiscount()}</Title>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell textAlign="left">
                  <Title>Coupon discounts:</Title>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Title>-AU${calculateDiscount()}</Title>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell textAlign="left">
                  <Title>Total:</Title>
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Title>AU${calculateTotal()}</Title>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>

          <Button type="button" onClick={buy} color="red" fluid>
            Complete Payment
          </Button>
        </Card.Content>
      </Card>
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
      <Message>
        <span>
          By completing your purchase you agree of these
          <ButtonLink onClick={() => setShowTermsModal(true)}>Terms of service</ButtonLink>
        </span>
      </Message>
    );
  };

  const showPaymentSection = () => (
    <div style={{ marginTop: 14 }}>
      {showError()}
      {showDropIn()}
      {showTerms()}
      {termsModal()}
    </div>
  );

  const termsModal = () => (
    <Modal closeOnEscape={true} open={showTermsModal} dimmer="blurring" size="large">
      <Header content="Terms or Service" />
      <Modal.Content scrolling>
        <Container
          textAlign="justified"
          style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, padding: "2rem", fontSize: "1.4rem" }}
        >
          {termsOfService}
        </Container>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setShowTermsModal(false)} color="green">
          <Icon name="checkmark" /> Got it!
        </Button>
      </Modal.Actions>
    </Modal>
  );

  return (
    <Layout title="Checkout" description="All payments are 100% secure">
      {shouldRedirect()}
      <Container>
        {data && data.success ? (
          showSuccess()
        ) : (
          <Grid centered>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={14} computer={11}>
                {showPaymentSection()}
              </Grid.Column>
              <Grid.Column mobile={16} tablet={14} computer={5}>
                {showTotalSection()}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column mobile={16} tablet={14} computer={11}>
                <Header>Order Summary</Header> {showCartItems()}
              </Grid.Column>
              <GridColumn computer={5} />
            </Grid.Row>
          </Grid>
        )}
      </Container>
    </Layout>
  );
};

export default Checkout;
