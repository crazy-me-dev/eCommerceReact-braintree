import axios from "axios";

export const getUser = async (userId, token) => {
  try {
    const res = await axios.get(`/api/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

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
export const updateUser = async (userId, token, user) => {
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

export const updateUserLocalStorage = (user, next = f => f) => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("jwt")) {
      let auth = JSON.parse(localStorage.getItem("jwt"));
      auth.user = user;

      localStorage.setItem("jwt", JSON.stringify(auth));

      if (user && user.address) {
        const { updatedAt, createdAt, ...address } = user.address;
        // console.log(address);
        localStorage.setItem("address", JSON.stringify(address));
      }
      next();
    }
  }
};

// if (typeof window !== "undefined") {
//   localStorage.setItem("jwt", JSON.stringify(data));

//   if (data && data.user && data.user.address) {
//     const { updatedAt, createdAt, ...address } = data.user.address;
//     console.log(address);
//     localStorage.setItem("address", JSON.stringify(address));
//   }

//   next();
// }
