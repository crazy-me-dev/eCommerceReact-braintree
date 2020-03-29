import { ADD_TO_CART, EMPTY_CART, UPDATE_CART_ITEM, DELETE_CART_ITEM } from "../actions/cartAction";

const initialState = {
  cart: []
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_TO_CART:
      let cart = state.cart || [];

      // possible values of result:
      //false: if no item with given id has been found
      //true: if the item was found and updated
      let result = cart.reduce((found, item) => {
        //if the item is already in the array we just increase the items count by one
        if (item._id === payload._id) {
          //if the price of the item has changed, we updated it here
          item.price = item.price === payload.price ? item.price : payload.price;
          item.count++;
          found = true;
        }
        return found;
      }, false);

      // if item was not found, then we add it here
      if (!result) cart.push({ ...payload, count: 1 });
      return { ...state, cart };

    case EMPTY_CART:
      return { ...state, ...initialState };

    case UPDATE_CART_ITEM: {
      const tempCart = state.cart;

      tempCart.map((product, i) => {
        if (product._id === payload.productId) tempCart[i].count = payload.count;
        return tempCart[i];
      });

      return { ...state, cart: tempCart };
    }

    case DELETE_CART_ITEM: {
      let tempCart = state.cart;
      tempCart = tempCart.filter(product => product._id !== payload.productId);

      return { ...state, cart: tempCart };
    }

    default:
      return state;
  }
};
