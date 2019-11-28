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
    next();
  }
};

export const signout = async next => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("jwt");
    next();
    try {
      const res = await axios.get("api/signout");
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
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
