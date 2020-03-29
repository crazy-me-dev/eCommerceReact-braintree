import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { useLastLocation } from "react-router-last-location";
import {
  Table,
  Container,
  Header,
  Divider,
  Button,
  Card,
  Grid,
  Form,
  Message
} from "semantic-ui-react";
import moment from "moment";

/**custom imports */
import Layout from "../layout/Layout";
import DashboardLayout from "../layout/DashboardLayout";
import { ButtonContainer } from "../common/components/customComponents";
import { getSingleOrder, getStatusValues, updateStatusValues } from "./apiAdmin";

const OrderDetail = props => {
  const { user: authUser, token } = useSelector(state => ({
    ...state.authReducer
  }));
  const { _id: userId, role } = authUser ? authUser : null;
  const lastLocation = useLastLocation();

  const [order, setOrder] = useState({});
  const [statusValues, setStatusValues] = useState([]);
  const [error, setError] = useState(false);

  const { _id, status, products, amount, user, createdAt, updatedAt, address, paymentType } = order;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = _id => async (e, { value }) => {
    const response = await updateStatusValues(userId, token, _id, value);
    if (response.error) {
      setError(response.error);
    } else {
      loadSingleOrder();
    }
  };
  /** status options use with category select element*/
  const statusOptions =
    statusValues &&
    statusValues.map((s, i) => {
      return { key: i, value: s, text: s };
    });

  const showError = () => (
    <Message color="red" style={{ display: error ? "" : "none", fontSize: "1.3rem" }}>
      {error}
    </Message>
  );

  if (lastLocation && lastLocation.pathname === "/cart") {
    return <Redirect to="/cart" />;
  }

  const goBack = () => (
    <ButtonContainer>
      <Button
        fluid
        as={Link}
        to={`${role && role === 1 ? "/admin/dashboard" : "/user/dashboard"}`}
        color="red"
        icon="left arrow"
        labelPosition="right"
        style={{ marginBottom: "1rem" }}
        content="Back to Dashboard"
      />
    </ButtonContainer>
  );

  const showOrderDetails = () => {
    return (
      <Card fluid>
        <Card.Content>
          <Grid doubling stackable columns={3}>
            <Grid.Row>
              <Grid.Column>
                <Form.Input fluid label="Order Id" value={`${_id}`} disabled />
              </Grid.Column>

              <Grid.Column>
                <Form.Select
                  fluid
                  disabled={role === 1 ? false : true}
                  label="Status"
                  name="status"
                  value={status}
                  options={statusOptions}
                  onChange={handleChange(_id)}
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  fluid
                  label="Delivery type"
                  value={`${address ? "Home delivery" : "E-delivery"}`}
                  disabled
                />
              </Grid.Column>

              <Grid.Column>
                <Form.Input
                  fluid
                  label="Added on"
                  value={`${createdAt && moment(createdAt).format("lll")}`}
                  disabled
                />
              </Grid.Column>
              <Grid.Column>
                <Form.Input
                  fluid
                  label="Last Update"
                  value={`${updatedAt && moment(updatedAt).format("lll")}`}
                  disabled
                />
              </Grid.Column>

              <Grid.Column>
                <Form.Input fluid label="Payment Type" value={`${paymentType}`} disabled />
              </Grid.Column>
              <Grid.Column computer={5}>
                <Form.Input fluid label="Customer Name" value={`${user && user.name}`} disabled />
              </Grid.Column>

              <Grid.Column computer={11}>
                <Form.Input fluid label="Delivery Address" value={`${address}`} disabled />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    );
  };

  const showProductDetails = () => {
    let tableItems =
      products &&
      products.map(({ _id, name, count, price }) => (
        <Table.Row key={_id}>
          <Table.Cell>{name && name}</Table.Cell>
          <Table.Cell>{price && price.toFixed(2)}</Table.Cell>
          <Table.Cell>{count & count}</Table.Cell>
          <Table.Cell> {price && count && (count * price).toFixed(2)}</Table.Cell>
        </Table.Row>
      ));

    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell>Sub-total</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tableItems}
          <Table.Row>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell>Total:</Table.Cell>
            <Table.Cell>{amount && amount.toFixed(2)}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  };
  return (
    <Layout isDashboard={true}>
      <DashboardLayout>
        <Container fluid style={{ marginTop: "2rem" }}>
          <Header as="h1">Order Details</Header>
        </Container>
        <Divider />
        {goBack()}
        {showError()}
        {showOrderDetails()}
        {showProductDetails()}
      </DashboardLayout>
    </Layout>
  );
};

export default OrderDetail;
