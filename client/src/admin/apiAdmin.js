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

export const getCategories = async () => {
  try {
    const res = await axios.get(`/api/categories`);
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};
