import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { List } from "semantic-ui-react";
import { colorPrimaryLight2 } from "../utils/variables";
import { media } from "../utils/mediaQueriesBuilder";

const ListUI = styled(List)`
  color: #f8f8f9;
  cursor: pointer;
  .icon {
    margin-right: 1rem;
  }

  ${media.sizeMedium`  
      display: grid;  
      grid-template-columns: repeat(5,1fr);  
      border-bottom: 1px solid #e3e3e5;
      background-color: #f4f4f9;
    `}
  ${media.sizeSmall`grid-template-columns: repeat(3,1fr); `}
`;

const ListItemUI = styled(List.Item)`
  border-bottom: 1px solid #e3e3e5;
  display: flex;
  font-size: 1.3rem;
  padding: 1.5rem 1.2rem;

  :hover {
    background-color: ${colorPrimaryLight2};
    color: inherit;
  }

  :active {
    background-color: rgba(255, 255, 255, 0.15);
    color: inherit;
  }

  ${media.sizeMedium`  
       flex-direction: column; 
       border-bottom: none;  
       align-items: center;   
       font-size: 1.1rem;
       .icon{
        margin-bottom: 1rem;
      }
    `}
  ${media.sizeSmall`  
       flex-direction: row; 
       padding: 1rem 1rem;
       align-content: center;
       .icon{
        margin-bottom: 0;
        
      }
    `}
    ${media.sizeSmall2`    
       flex-direction: column;        
       align-content: center;
       .icon{
        margin-bottom: 1rem;        
      }
    `}

   
`;

const Sidebar = () => {
  return (
    <ListUI divided>
      <ListItemUI as={Link} to="/admin">
        <List.Icon className="icon" size="large" color="green" name="home" />
        <List.Content className="content">Dashboard</List.Content>
      </ListItemUI>
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
      <ListItemUI as={Link} to="/admin">
        <List.Icon size="large" color="pink" name="chart line" />
        <List.Content>Sales</List.Content>
      </ListItemUI>
    </ListUI>
  );
};

export default Sidebar;
