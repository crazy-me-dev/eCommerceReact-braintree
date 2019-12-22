import React from "react";
import { Grid, Container } from "semantic-ui-react";
import styled from "styled-components";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <Grid doubling stackable>
      <Grid.Row>
        <Grid.Column id="column-sidebar" computer={3} tablet={16}>
          <Sidebar />
        </Grid.Column>

        <Grid.Column id="column-content" computer={13} tablet={16}>
          <Container fluid>{children}</Container>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default DashboardLayout;
