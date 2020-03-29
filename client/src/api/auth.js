import axios from "axios";
export const signupApi = async user => {
  try {
    const res = await axios.post("/api/signup", user);
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const signinApi = async user => {
  try {
    const res = await axios.post("/api/signin", user);
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const signOutApi = async () => {
  try {
    const res = await axios.get("api/signout");
    return res.data;
  } catch (error) {}
};

export const updateAddressApi = async ({ address, userId, token }) => {
  try {
    const res = await axios.put(
      `/api/user/${userId}`,
      { address: address },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const updateUserApi = async ({ userId, token, user }) => {
  try {
    const res = await axios.put(`/api/user/${userId}`, user, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};
