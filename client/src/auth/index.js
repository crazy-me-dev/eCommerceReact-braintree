import axios from "axios";

export const signup = async user => {
  try {
    const res = await axios.post("/api/signup", user);
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const signin = async user => {
  try {
    const res = await axios.post("/api/signin", user);
    return res.data;
  } catch (e) {
    //the error in axios comes in response.data object
    return e.response.data;
  }
};

export const authenticate = (data, next) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));

    if (data && data.user && data.user.address) {
      const { updatedAt, createdAt, ...address } = data.user.address;
      console.log(address);
      localStorage.setItem("address", JSON.stringify(address));
    }

    next();
  }
};

export const signout = async next => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    if (localStorage.getItem("address")) {
      localStorage.removeItem("address");
    }
    next();
    try {
      const res = await axios.get("api/signout");

      return res.data;
    } catch (error) {}
  }
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else return false;
};

export const updateUserAddress = async (address, userId, token) => {
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
