import axios from "axios";
import queryString from "query-string";

export const getProducts = async (sortBy, order = "desc", limit = 8) => {
  try {
    const res = await axios.get(`/api/products?sortBy=${sortBy}&order=${order}&limit=${limit}`);
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const getCategories = async () => {
  try {
    const res = await axios.get(`/api/categories`);
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const getFilteredProducts = async (skip, limit, filters = {}) => {
  const data = {
    limit,
    skip,
    filters
  };
  try {
    const res = await axios.post(`/api/products/by/search`, data);
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const getSearchedProducts = async params => {
  const query = queryString.stringify(params);
  try {
    const res = await axios.get(`/api/products/search?${query}`);
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const getProduct = async productId => {
  try {
    const res = await axios.get(`/api/product/${productId}`);
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const getRelatedProducts = async productId => {
  try {
    const res = await axios.get(`/api/products/related/${productId}`);
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const getBraintreeClientToken = async (userId, token) => {
  try {
    const res = await axios.get(`/api/braintree/token/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const processPayment = async (userId, token, paymentData) => {
  try {
    const res = await axios.post(`/api/braintree/payment/${userId}`, paymentData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const createOrder = async (orderData, userId, token) => {
  try {
    const res = await axios.post(`/api/order/create/${userId}`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};
