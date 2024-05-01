import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart } from '../../redux/reducers/cart-reducer';
import Table from 'react-bootstrap/Table';
import { Link, useNavigate } from "react-router-dom"
import NavScroll from '../../components/Navbar';
// import axios from "axios";
// import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormatNumber } from '../../Utils';

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  // const [address, setAddress] = useState('')
  // const [paymentMethod, setPaymentMethod] = useState(null);
  const cartItems = useSelector((state) => state.shoppingCart.cartItems);


  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmitCart = async (e) => {
    e.preventDefault()
    const userId = localStorage.getItem('id')
    if (userId) {
      const order = {
        cartItems: cartItems,
        total: calculateTotal(),
      }
      localStorage.setItem('order', JSON.stringify(order));
      navigate('/payment')

      // try {
      //   if (address.trim().length < 10) {
      //     toast.error('Hãy nhập địa chỉ hợp lệ')
      //     return
      //   }

      //   await axios.post(process.env.REACT_APP_ORDER_API + `add`, {
      //     cartItems: cartItems,
      //     total: calculateTotal(),
      //     userId: userId,
      //     address: address,
      //   })

      //   dispatch(clearCart())
      //   toast.success('Đặt hàng thành công')
      // } catch (error) {
      //   console.log(error)
      // }
    } else {
      navigate('/login')
    }
  }
  // const addAdress = async () => {
  //   const { data: { user: { address: currentAddress } } } = await axios.get(process.env.REACT_APP_USER_API + `${localStorage.getItem('id')}`)
  //   setAddress(currentAddress)
  // }

  return (
    <>
      <NavScroll />
      <div className='cart'>
        {cartItems.length === 0 ? (
          <div className='noItem'>
            <i class="bi bi-bag-x"></i>
            <p>Không có sản phẩm nào trong giỏ hàng.</p>
            <Link className='btn btn-outline-dark' to='/'>Tiếp tục mua sắm</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmitCart}>
            <h1 className='mb-3'>Giỏ Hàng</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Tên Sản Phẩm</th>
                  <th>Giá</th>
                  <th>Số Lượng</th>
                  <th>Thành Tiền</th>
                  <th style={{ display: 'flex', justifyContent: 'center' }}></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{FormatNumber(String(item.price))} đ</td>
                    <td>{item.quantity}</td>
                    <td>{FormatNumber(String(item.price * item.quantity))} đ</td>
                    <td style={{ display: 'flex', justifyContent: 'center' }}>
                      <div >
                        <button className='btn btn-outline-danger' onClick={() => dispatch(removeFromCart(item.id))}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan='3'></td>
                  <td>Tổng:</td>
                  <td>{FormatNumber(String(calculateTotal()))} đ</td>
                </tr>
              </tfoot>
            </Table>
            {/* <div className='mt-3'>
              {(localStorage.getItem('id')) ? (
                <div class="input-group mb-5">
                  <input type="text" class="form-control" placeholder="Chọn địa chỉ nhận hàng" aria-label="Recipient's username" aria-describedby="basic-addon2"
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                  />
                  <div class="input-group-append">
                    <button onClick={() => addAdress()} class="btn btn-outline-dark" type="button">Sử dụng địa chỉ mặc định</button>
                  </div>
                </div>
              ) : null}
            </div> */}
            <div className="text-center">
              <button
                className={`btn btn-dark py-2 mx-2`}             >
                Mua Hàng
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Cart;