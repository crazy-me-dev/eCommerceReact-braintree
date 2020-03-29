import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Container, Divider, Button, Grid, Header, Table, Icon } from "semantic-ui-react";
import moment from "moment";

/**custom imports */
import { useSelector } from "react-redux";
import Layout from "../layout/Layout";
import DashboardLayout from "../layout/DashboardLayout";
import { getHistory } from "./apiUser";
import { ButtonContainer } from "../common/components/customComponents";

/**
 * Styling elements with styled-components
 * Semantic UI modified elements' name will end with 'UI'
 */

const Title = styled.p`
  font-size: 1.3rem;
  font-family: "Segoe UI", sans-serif;
  padding-top: 1rem;
`;

const Dashboard = () => {
  const { user, token } = useSelector(state => ({
    ...state.authReducer
  }));

  const { _id: userId, role, name, address, email } = user ? user : null;
  const [values, setValues] = useState({
    history: [],
    error: false,
    success: false
  });

  const { history, error, success } = values;

  const load = async () => {
    const userHistory = await getHistory(userId, token);
    if (userHistory.error) {
      setValues({ ...values, error: userHistory.error });
    } else {
      setValues({ ...values, error: false, success: true, history: userHistory });
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildAddress = ({ street, city, state, zip, country }) => {
    return `${street} ${city} ${state} ${zip} ${country}`;
  };

  const adminInfo = () => {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={16}>
            <Title>{name}</Title>
          </Grid.Column>
          <Grid.Column mobile={16}>
            <Title>{email}</Title>
          </Grid.Column>
          <Grid.Column mobile={16}>
            <Title>{address ? buildAddress(address) : null}</Title>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  };

  const showOrders = () => {
    let tableItems =
      history &&
      history.map(({ status, _id, amount, address, createdAt, updatedAt }) => (
        <Table.Row key={_id}>
          <Table.Cell>
            <Link to={`/user/history/${_id}`}>{_id && _id}</Link>
          </Table.Cell>
          <Table.Cell>{status && status}</Table.Cell>
          <Table.Cell>${amount && amount.toFixed(2)}</Table.Cell>
          <Table.Cell>{address && address.substring(0, 25)}...</Table.Cell>
          <Table.Cell>{createdAt && moment(createdAt).format("ll")}</Table.Cell>
          <Table.Cell>{updatedAt && moment(updatedAt).format("ll")}</Table.Cell>
        </Table.Row>
      ));

    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Order Id</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
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
          <Header as="h1"> {role === 1 ? "Admin " : "Registered User "}Management</Header>
          {adminInfo()}
        </Container>
        <Divider />
        <ButtonContainer>
          <Button fluid color="blue" as={Link} to={`/profile/${userId}`}>
            Update Profile
          </Button>
        </ButtonContainer>

        <Container fluid style={{ marginTop: "1rem" }} textAlign="center">
          {role === 0 ? (
            showOrders()
          ) : (
            <>
              <Header as="h1" color="blue" icon>
                <Icon name="settings" />
                Good things are coming....
                <Header.Subheader>This page is under contruction</Header.Subheader>
              </Header>{" "}
            </>
          )}
        </Container>
      </DashboardLayout>
    </Layout>
  );
};
export default Dashboard;
