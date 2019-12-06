import React from "react";
import { withRouter, Link } from "react-router-dom";

import { signout, isAuthenticated } from "../auth";

import { getCartCount } from "./cartHelper";

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#ff9900" };
  return { color: "#ffffff" };
};

const Menu = ({ history }) => {
  const { user } = isAuthenticated();

  return (
    <div>
      <ul className="nav nav-tabs py-2 bg-primary">
        <a className="navbar-brand" href="/" style={{ color: "#ffffff" }}>
          Bookify
        </a>
        <li className="nav-item">
          <Link className="nav-link" to="/" style={isActive(history, "/")}>
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to="/shop" style={isActive(history, "/shop")}>
            Shop
          </Link>
        </li>

        <li className="nav-item" style={{ position: "relative" }}>
          <Link className="nav-link" to="/cart" style={isActive(history, "/cart")}>
            Cart{" "}
            <sup>
              {" "}
              <small className="cart-badge">{getCartCount()}</small>
            </sup>
          </Link>
        </li>

        {user && user.role === 1 && (
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/admin/dashboard"
              style={isActive(history, "/admin/dashboard")}
            >
              Admin Dashboard
            </Link>
          </li>
        )}

        {user && user.role === 0 && (
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/user/dashboard"
              style={isActive(history, "/user/dashboard")}
            >
              Dashboard
            </Link>
          </li>
        )}

        {!user && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/signin" style={isActive(history, "/signin")}>
                Signin
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup" style={isActive(history, "/signup")}>
                Signup
              </Link>
            </li>
          </>
        )}

        {user && (
          <>
            <li className="nav-item">
              <span
                className="nav-link"
                style={{ cursor: "pointer", color: "#ffffff" }}
                onClick={() => {
                  signout(() => {
                    history.push("/");
                  });
                }}
              >
                Signout
              </span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default withRouter(Menu);
