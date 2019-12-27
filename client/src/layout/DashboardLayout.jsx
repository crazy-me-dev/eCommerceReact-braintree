import React from "react";
import { Grid, Container } from "semantic-ui-react";
import styled from "styled-components";

/**custom imports */
import Sidebar from "./Sidebar";
import { mediaUI as media } from "../utils/mediaQueriesBuilder";

/**
 * Styling elements with styled-components
 * Semantic UI modified elements' name will end with 'UI'
 */

const ContainerUI = styled(Container)`
  ${media.large`
margin-right: 2rem !important;
`}
`;

const DashboardLayout = ({ children }) => {
  return (
    <Grid doubling stackable centered>
      <Grid.Row>
        <Grid.Column id="column-sidebar" tablet={16} computer={3} widescreen={2}>
          <Sidebar />
        </Grid.Column>

        <Grid.Column id="column-content" tablet={15} computer={12} widescreen={13}>
          <ContainerUI fluid>{children}</ContainerUI>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default DashboardLayout;
