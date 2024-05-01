import { configureStore } from '@reduxjs/toolkit';
import shoppingCartReducer from './reducers/cart-reducer';

const store = configureStore({
  reducer: {
    shoppingCart: shoppingCartReducer,
  },
});

export default store;