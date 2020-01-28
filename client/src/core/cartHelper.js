export const addItem = (item = [], count = 0, next = f => f) => {
  let cart = [];
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    cart.push({ ...item, count: 1 });

    cart = Array.from(new Set(cart.map(p => p._id))).map(id => {
      return cart.find(p => p._id === id);
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    next();
  }
};

export const getCartCount = () => {
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart")).length;
    }
  }
  return 0;
};

export const getCartItems = () => {
  if (typeof window !== undefined) {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart"));
    }
  }
  return [];
};

export const updateItem = (productId, count) => {
  let cart = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    cart.map((product, i) => {
      if (product._id === productId) cart[i].count = count;
      return cart[i];
    });

    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

export const removeItem = productId => {
  let cart = [];
  if (typeof window !== "undefined") {
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    let updatedCart = cart.filter(product => product._id !== productId);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }
};

export const addAddress = (address, next = f => f) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("address", JSON.stringify(address));
    next();
  }
};
export const getAddress = () => {
  if (typeof window !== undefined) {
    if (localStorage.getItem("address")) {
      return JSON.parse(localStorage.getItem("address"));
    }
  }
  return null;
};

export const emptyCart = (next = f => f) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart");
    next();
  }
};
