
import { createSlice } from '@reduxjs/toolkit';

// Hàm để lưu trạng thái giỏ hàng vào localStorage
const saveCartToLocalStorage = (cartItems) => {
  localStorage.setItem('cart', JSON.stringify(cartItems));
};

const shoppingCartSlice = createSlice({
  name: 'shoppingCart',
  initialState: {
    cartItems: JSON.parse(localStorage.getItem('cart')) || [], // Khởi tạo từ localStorage nếu có
  },
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, quantity } = action.payload;
      const existingItem = state.cartItems.find(item => item.id === id);

      if (existingItem) {
        // Nếu sản phẩm đã tồn tại, tăng quantity
        existingItem.quantity += quantity;
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
        state.cartItems.push({
          id,
          name,
          price,
          quantity,
        });
      }

      // Lưu trạng thái giỏ hàng vào localStorage
      saveCartToLocalStorage(state.cartItems);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);

      // Lưu trạng thái giỏ hàng vào localStorage
      saveCartToLocalStorage(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = []
      localStorage.removeItem('cart');
    }
  },
});

export const { addToCart, removeFromCart, clearCart } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
