import axios from "axios";

export const signup = async user => {
  try {
    return await axios.post("/api/signup", user);
  } catch (e) {
    console.log(e.response);

    return { error: e.response.data };
  }
};
