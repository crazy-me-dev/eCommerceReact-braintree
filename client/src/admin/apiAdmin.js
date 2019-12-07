import axios from "axios";

export const createCategory = async (category, userId, token) => {
  try {
    const res = await axios.post(`/api/category/create/${userId}`, category, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const createProduct = async (product, userId, token) => {
  try {
    const res = await axios.post(`/api/product/create/${userId}`, product, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const updateProduct = async (product, userId, token, productId) => {
  try {
    const res = await axios.put(`/api/product/${productId}/${userId}`, product, {
      headers: { Authorization: `Bearer ${token}` }
    });

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
export const getProduct = async productId => {
  try {
    const res = await axios.get(`/api/product/${productId}`);
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const getProducts = async (limit = 6) => {
  try {
    const res = await axios.get(`/api/products?limit=${limit}`);
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const removeProduct = async (userId, token, productId) => {
  try {
    const res = await axios.delete(`/api/product/${productId}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};
