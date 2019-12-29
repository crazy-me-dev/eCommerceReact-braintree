import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { LastLocationProvider } from "react-router-last-location";

import PrivateRoute from "./auth/PrivateRoute";
import AdminRoute from "./auth/AdminRoute";

import Signin from "./user/Signin";
import Signup from "./user/Signup";
import Home from "./core/Home";
import Shop from "./core/Shop";
import Product from "./core/Product";
import Dashboard from "./user/Dashboard";
import Profile from "./user/Profile";
import AddCategory from "./admin/AddCategory";
import AddProduct from "./admin/AddProduct";
import ManageProduct from "./admin/ManageProduct";
import ManageCategory from "./admin/ManageCategory";
import ManageOrder from "./admin/ManageOrder";
import OrderDetail from "./admin/OrderDetail";
import ShoppingCart from "./core/ShoppingCart";
import Payment from "./core/Payment";

const Routes = () => {
  return (
    <BrowserRouter>
      <LastLocationProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/shop" exact component={Shop} />
          <Route path="/signin" exact component={Signin} />
          <Route path="/signup" exact component={Signup} />
          <PrivateRoute path="/user/dashboard" exact component={Dashboard} />
          <PrivateRoute path="/profile/:userId" exact component={Profile} />
          <PrivateRoute path="/user/history/:orderId" exact component={OrderDetail} />

          <AdminRoute path="/admin/dashboard" exact component={Dashboard} />

          <AdminRoute path="/admin/product" exact component={ManageProduct} />
          <AdminRoute path="/admin/product/create" exact component={AddProduct} />
          <AdminRoute path="/admin/product/:productId" exact component={AddProduct} />

          <AdminRoute path="/admin/category" exact component={ManageCategory} />
          <AdminRoute path="/admin/category/create" exact component={AddCategory} />
          <AdminRoute path="/admin/category/:categoryId" exact component={AddCategory} />

          <AdminRoute path="/admin/order" exact component={ManageOrder} />
          <AdminRoute path="/admin/order/:orderId" exact component={OrderDetail} />

          <Route path="/product/:productId" exact component={Product} />
          <Route path="/cart" exact component={ShoppingCart} />
          <Route path="/payment" exact component={Payment} />
          <Route match="/home" component={Home} />
        </Switch>
      </LastLocationProvider>
    </BrowserRouter>
  );
};

export default Routes;
