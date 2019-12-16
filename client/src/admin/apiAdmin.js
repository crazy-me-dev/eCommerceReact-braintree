import axios from "axios";

/**
 *
 * All category methods
 */

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

export const updateCategory = async (category, userId, token, categoryId) => {
  try {
    const res = await axios.put(`/api/category/${categoryId}/${userId}`, category, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const getCategoriesInUse = async () => {
  try {
    const res = await axios.get(`/api/products/categories`);
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const getCategory = async (userId, token, categoryId) => {
  try {
    const res = await axios.get(`/api/category/${categoryId}/${userId}`, {
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

export const removeCategory = async (userId, token, categoryId) => {
  try {
    const res = await axios.delete(`/api/category/${categoryId}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

/**
 *
 * All product methods
 */

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

/**
 *
 * All order methods
 */

export const getOrders = async (userId, token) => {
  try {
    const res = await axios.get(`/api/order/list/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const getSingleOrder = async (userId, token, orderId) => {
  try {
    const res = await axios.get(`/api/order/${orderId}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const getStatusValues = async (userId, token) => {
  try {
    const res = await axios.get(`/api/order/statusValues/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    console.log(e);

    return e.response.data;
  }
};

export const updateStatusValues = async (userId, token, orderId, newStatus) => {
  try {
    const res = await axios.put(
      `/api/order/${orderId}/${userId}`,
      { newStatus },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    console.log(e);

    return e.response.data;
  }
};
