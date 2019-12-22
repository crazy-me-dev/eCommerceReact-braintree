/**
 * Menu is build with styled components
 * All CSS and JS code is one file
 */

import React, { useState } from "react";
import { Label } from "semantic-ui-react";
import classNames from "classnames";
import styled from "styled-components";
import { withRouter, Link } from "react-router-dom";

//custom imports
import { signout, isAuthenticated } from "../auth";
import { getCartCount } from "./cartHelper";
import { colorPrimary, colorGrey6 } from "../utils/variables";
import { media } from "../utils/mediaQueriesBuilder";
import { ReactComponent as BurgerIcon } from "../images/svgs/menu.svg";

// once user scrolls pass header section, navbar sticks at top and is blue
const Nav = styled.nav`
  /* position: fixed; */
  left: 0;
  right: 0;
  z-index: 999;
  color: #fff;
  background-color: ${colorPrimary};
  box-shadow: "0 .1rem .15rem rgba(0,0,0,.3)";
`;

// nav becomes collapsible via toggle button if screen is small
const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 1.6rem 3rem;

  .collapsible {
    ${media.sizeSmall1`
			position: absolute;
			display: inline;
			top: 100%;
			right: 0;
			margin: .5rem;
			padding: 1rem;
			z-index: 9999;
			background-color: ${colorPrimary};
			box-shadow: "0 .1rem .15rem rgba(0,0,0,.3)";
			border-radius: 3px;
			transition: all .2s;
			visibility: hidden;
			opacity: 0;
		`}

    &--toggle {
      visibility: visible;
      opacity: 1;
    }
  }

  .nav-list {
    position: relative;
    display: flex;
    list-style: none;
    ${media.sizeSmall1`
			flex-direction: column;
		`}

    &--item-active {
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.15);
    }
  }
`;

const Brand = styled.div`
  height: 100%;
`;

const Name = styled(Link)`
  font-family: inherit;
  white-space: nowrap;
  font-size: 2.5rem;
  font-weight: 600;
  color: inherit;
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;

  :hover,
  :active {
    color: inherit;
  }

  ${media.sizeMedium`
  font-size: 2rem;
    `}

  ${media.sizeSmall`
  font-size: 1.5rem; 
    `}
    ${media.sizeSmall1`
  font-size: 1.9rem; 
    `}
`;

const Toggler = styled.button`
  display: none;
  position: relative;
  fill: #fff;
  background-color: transparent;
  backface-visibility: hidden;
  height: 3rem;
  width: 3rem;
  transition: all 1s;
  border: none;
  cursor: pointer;
  outline: none;

  :hover {
    fill: ${colorGrey6};
  }

  ${media.sizeSmall1`
			display: block;
		`}
`;

const Item = styled.li`
  position: relative;
  :not(:last-child) {
    margin-right: 0.3rem;
  }

  ${media.sizeSmall1`
    width: 100%;        
		:not(:last-child){
			margin-bottom: 1.2rem;
    };  
	`}
`;

const LinkButton = styled(Link)`
  font-family: inherit;
  font-size: 1.4rem;
  font-weight: 300;
  white-space: nowrap;
  padding: 1rem 1.2rem;
  background: transparent;
  color: inherit;
  border: none;
  cursor: pointer;
  outline: none;
  border-radius: 4px;
  transition: all 0.2s;

  :hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: inherit;
  }

  :active {
    background-color: rgba(255, 255, 255, 0.15);
    color: inherit;
  }

  ${media.sizeMedium`
  padding: 1rem 1rem;
    `}
    
  ${media.sizeSmall`
  font-size: 1.2rem;
  padding: 1rem .7rem;
    `}

  ${media.sizeSmall1`
			width: 100%;
      text-align: left;
      padding: .6rem 1.5rem;
		`}
`;

const Button = styled.a`
  font-family: inherit;
  font-size: 1.4rem;
  font-weight: 300;
  white-space: nowrap;
  padding: 1rem 1.2rem;
  background: transparent;
  color: inherit;
  border: none;
  cursor: pointer;
  outline: none;
  border-radius: 4px;
  transition: all 0.2s;

  :hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: inherit;
  }

  :active {
    background-color: rgba(255, 255, 255, 0.15);
    color: inherit;
  }

  ${media.sizeMedium`
  padding: 1rem 1rem;
    `}
    
  ${media.sizeSmall`
  font-size: 1.2rem;
  padding: 1rem .7rem;
    `}

  ${media.sizeSmall1`
			width: 100%;
      text-align: left;
      padding: .6rem 1.5rem;
		`}
`;

const Badge = styled(Label)`
  ${media.sizeSmall1`
		transform: translateX(-8.5rem);
		`}
`;

//------------------------------------------------------------------------------

const Menu = ({ history }) => {
  const { user } = isAuthenticated();
  const [isToggleOn, setIsToggleOn] = useState(false);

  //display and hides the menu on mobile devices
  const toggleCollapsible = show => {
    if (show && isToggleOn) setIsToggleOn(!show);
    else setIsToggleOn(show);
  };

  return (
    <Nav>
      <Wrapper>
        <Brand>
          <Name to="/">e-Shopland</Name>
        </Brand>
        <Toggler
          onClick={() => {
            toggleCollapsible(true);
          }}
          onBlur={() => {
            toggleCollapsible(false);
          }}
        >
          <BurgerIcon />
        </Toggler>
        <div
          className={isToggleOn ? classNames("collapsible", "collapsible--toggle") : "collapsible"}
        >
          <div className="nav-list">
            <Item>
              <LinkButton to="/">Home</LinkButton>
            </Item>
            <Item>
              <LinkButton to="/shop">Shop</LinkButton>
            </Item>
            <Item>
              <LinkButton to="/cart">
                Cart
                <Badge circular floating color="pink">
                  {getCartCount()}
                </Badge>
              </LinkButton>
            </Item>

            {user && user.role === 1 && (
              <Item>
                <LinkButton to="/admin">Admin</LinkButton>
              </Item>
            )}
            {user && user.role === 0 && (
              <Item>
                <LinkButton to="/user/dashboard">Dashboard</LinkButton>
              </Item>
            )}

            {!user && (
              <>
                <Item>
                  <LinkButton to="/signin">Signin</LinkButton>
                </Item>
                <Item>
                  <LinkButton to="/signup">Signup</LinkButton>
                </Item>
              </>
            )}
            {user && (
              <Item>
                <Button
                  onClick={() => {
                    signout(() => {
                      history.push("/");
                    });
                  }}
                >
                  Signout
                </Button>
              </Item>
            )}
          </div>
        </div>
      </Wrapper>
    </Nav>
  );
};

export default withRouter(Menu);
