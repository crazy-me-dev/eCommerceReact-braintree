import React from "react";
import Menu from "./Menu";
import styled from "styled-components";
import { Header, Segment } from "semantic-ui-react";
import { mediaUI as media } from "../utils/mediaQueriesBuilder";

/**
 * Styling elements with styled-components
 * Semantic UI modified elements' name will end with 'UI'
 */

//creating a segment to act like a Jumbotron
const SegmentUI = styled(Segment)`
  min-height: 10rem !important;
  ${media.computer`min-height: 15rem !important;`}
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
      {/* if isDashboard true we dont display the SegmentUI */}
      {!isDashboard && (
        <div>
          <SegmentUI placeholder>
            <div>
              <Header as="h1" style={{ marginLeft: "3rem" }}>
                {title}
              </Header>
              <Header as="h3" style={{ marginLeft: "3rem", marginTop: "1rem" }}>
                {description}
              </Header>
            </div>
          </SegmentUI>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Layout;
