import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { List } from "semantic-ui-react";

/**custom imports */
import { colorPrimaryLight2 } from "../utils/variables";
import { mediaUI as media } from "../utils/mediaQueriesBuilder";
import { isAuthenticated } from "../auth";

/**
 * Styling elements with styled-components
 * Semantic UI modified elements' name will end with 'UI'
 */

const ListUI = styled(List)`
  color: #f8f8f9;
  cursor: pointer;
  .icon {
    margin-right: 1rem;
  }

  display: grid;
  border-bottom: 1px solid #e3e3e5;
  background-color: #f4f4f9;
  grid-template-columns: repeat(3, 1fr);

  ${media.mobile`grid-template-columns: repeat(5, 1fr);`}
  ${media.computer`display: inline;`}
`;

const ListItemUI = styled(List.Item)`  
  font-size: 1.3rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  .icon {
    margin-bottom: 1rem;
  }

  :hover {
    background-color: ${colorPrimaryLight2};
    color: inherit;
  }

  :active {
    background-color: rgba(255, 255, 255, 0.15);
    color: inherit;
  }

  
  /* media */
  ${media.small`  
  flex-direction: row;
  padding: 1rem 1rem;
  align-content: center;
  .icon {
    margin-bottom: 0;
  }  
  `}

  /* media */
  ${media.mobile` 
  flex-direction: column;
  border-bottom: none;
  align-items: center;
  font-size: 1.1rem;
  .icon {
    margin-bottom: 1rem;
    /* margin-left: 1rem; */
  }
  `}

  ${media.tablet`font-size: 1.5rem;`}
  ${media.computer`
  flex-direction: row;
  padding: 1.5rem 1rem;  
  align-content: center;
  border-bottom: 1px solid #e3e3e5;

  .icon {
    margin-bottom: 0;
  }  
  `}
`;

const Sidebar = () => {
  const { user } = isAuthenticated();
  return (
    <ListUI divided>
      <ListItemUI
        as={Link}
        to={`${user && user.role === 1 ? "/admin/dashboard" : "/user/dashboard"}`}
      >
        <List.Icon className="icon" size="large" color="green" name="home" />
        <List.Content className="content">Dashboard</List.Content>
      </ListItemUI>
      {user && user.role === 1 && (
        <>
          <ListItemUI as={Link} to="/admin/order">
            <List.Icon size="large" color="blue" name="truck" />
            <List.Content>Orders</List.Content>
          </ListItemUI>
          <ListItemUI as={Link} to="/admin/category">
            <List.Icon size="large" color="olive" name="target" />
            <List.Content>Categories</List.Content>
          </ListItemUI>
          <ListItemUI as={Link} to="/admin/product">
            <List.Icon size="large" color="teal" name="shop" />
            <List.Content>Products</List.Content>
          </ListItemUI>
          <ListItemUI as={Link} to="/admin/dashboard">
            <List.Icon size="large" color="pink" name="chart line" />
            <List.Content>Sales</List.Content>
          </ListItemUI>
        </>
      )}
    </ListUI>
  );
};

export default Sidebar;
