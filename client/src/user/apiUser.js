import axios from "axios";

export const getHistory = async (userId, token) => {
  try {
    const res = await axios.get(`/api/user/history/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};
