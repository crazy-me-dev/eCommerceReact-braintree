import React from "react";
import Menu from "./Menu";
import styled from "styled-components";
import { Header, Segment } from "semantic-ui-react";

//creating a segment to act like a Botstrap Jumbotron
const Jumbotron = styled(Segment)`
  min-height: 15rem !important;
`;

const Layout = ({
  title = "Title",
  description = "Description",
  children,
  isDashboard = false
}) => {
  return (
    <div>
      <Menu />
      {/* if isDashboard true we dont display the Jumbotron */}
      {!isDashboard && (
        <div>
          <Jumbotron placeholder>
            <div>
              <Header as="h1" style={{ marginLeft: "3rem" }}>
                {title}
              </Header>
              <Header as="h3" style={{ marginLeft: "3rem", marginTop: "1rem" }}>
                {description}
              </Header>
            </div>
          </Jumbotron>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Layout;
