import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { Container, Divider, Header, Table, Select } from "semantic-ui-react";

/**custom imports */
import Layout from "../layout/Layout";
import DashboardLayout from "../layout/DashboardLayout";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = _id => async (e, { value }) => {
    const response = await updateStatusValues(userId, token, _id, value);
    if (response.error) {
      setValues({ ...values, error: response.error });
    } else {
      loadOrders();
    }
  };

  /** status options use with category select element*/
  const statusOptions =
    statusValues &&
    statusValues.map((s, i) => {
      return { key: i, value: s, text: s };
    });

  const showOrders = () => {
    let tableItems = orderList.map(
      ({ status, _id, amount, address, createdAt, updatedAt, user }) => (
        <Table.Row key={_id}>
          <Table.Cell>
            <Link to={`/admin/order/${_id}`}>{_id && _id}</Link>
          </Table.Cell>
          <Table.Cell>
            <Select
              width={4}
              label="Status"
              name="status"
              value={status}
              options={statusOptions}
              onChange={handleChange(_id)}
            />
          </Table.Cell>
          <Table.Cell>{user && user.name}</Table.Cell>
          <Table.Cell>${amount && amount.toFixed(2)}</Table.Cell>
          <Table.Cell>{address && address.substring(0, 25)}...</Table.Cell>
          <Table.Cell>{createdAt && moment(createdAt).format("ll")}</Table.Cell>
          <Table.Cell>{updatedAt && moment(updatedAt).format("ll")}</Table.Cell>
        </Table.Row>
      )
    );

    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Order Id</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Delivery Adress</Table.HeaderCell>
            <Table.HeaderCell>Created</Table.HeaderCell>
            <Table.HeaderCell>Last Update</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{tableItems}</Table.Body>
      </Table>
    );
  };

  return (
    <Layout isDashboard={true}>
      <DashboardLayout>
        <Container fluid style={{ marginTop: "2rem" }}>
          <Header as="h1">Order Management</Header>
        </Container>
        <Divider />
        <Header as="h3">List of Orders</Header>
        {showOrders()}
      </DashboardLayout>
    </Layout>
  );
};

export default ManageOrder;
