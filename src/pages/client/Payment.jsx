import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/reducers/cart-reducer';
import Table from 'react-bootstrap/Table';
import { Link, useNavigate } from "react-router-dom"
import NavScroll from '../../components/Navbar';
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormatNumber } from '../../Utils';
// import { PayPalButton } from "react-paypal-button-v2";

const Payment = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [address, setAddress] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('');
    const cartItems = useSelector((state) => state.shoppingCart.cartItems);


    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleSubmitCart = async (e) => {
        e.preventDefault()

        const userId = localStorage.getItem('id')

        if (userId) {
            try {
                if (paymentMethod === 'COD') {
                    if (address.trim().length < 10) {
                        toast.error('Hãy nhập địa chỉ hợp lệ')
                        return
                    }

                    const { data: { user } } = await axios.get(process.env.REACT_APP_USER_API + `${userId}`, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    })

                    const userName = user.name
                    const userPhone = user.phone

                    await axios.post(process.env.REACT_APP_ORDER_API + `add`, {
                        cartItems: cartItems,
                        total: calculateTotal(),
                        userId: userId,
                        userName: userName,
                        userPhone: userPhone,
                        address: address,
                        paymentMethod: paymentMethod
                    }, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    })
                    dispatch(clearCart())
                    toast.success('Đặt hàng thành công')
                }

                if (paymentMethod === 'Thanh toán trực tuyến') {

                    const { data: { data: redirect } } = await axios.post(process.env.REACT_APP_PAYMENT_API + `pay`, {
                        cartItems: cartItems,
                        total: calculateTotal(),
                        userId: userId,
                    })
                    console.log(redirect)

                    if (redirect) {
                        // Chuyển hướng tới đường link được trả về từ server
                        window.location.href = redirect;
                    } else {
                        // Nếu không có đường link, hiển thị thông báo
                        toast.error('Không tìm thấy đường link thanh toán');
                    }
                }

            } catch (error) {
                console.log(error)
            }
        } else {
            navigate('/login')
        }
    }
    const addAdress = async () => {
        const { data: { user: { address: currentAddress } } } = await axios.get(process.env.REACT_APP_USER_API + `${localStorage.getItem('id')}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        setAddress(currentAddress)
    }


    return (
        <>
            <NavScroll />
            <div className='cart ' >
                {cartItems.length === 0 ? (
                    <div className='noItem'>
                        <i class="bi bi-bag-x"></i>
                        <p>Không có sản phẩm nào trong giỏ hàng.</p>
                        <Link className='btn btn-outline-dark' to='/'>Tiếp tục mua sắm</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitCart}>
                        <h1 className='mb-3'>Thông tin đơn hàng</h1>
                        <div className='row'>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Tên Sản Phẩm</th>
                                        <th>Giá</th>
                                        <th>Số Lượng</th>
                                        <th>Thành Tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{FormatNumber(String(item.price))} đ</td>
                                            <td>{item.quantity}</td>
                                            <td>{FormatNumber(String(item.price * item.quantity))} đ</td>
                                            {/* <td style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div >
                                                <button className='btn btn-outline-danger' onClick={() => dispatch(removeFromCart(item.id))}>Xóa</button>
                                            </div>
                                        </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan='2'></td>
                                        <td>Tổng:</td>
                                        <td>{FormatNumber(String(calculateTotal()))} đ</td>
                                    </tr>
                                </tfoot>
                            </Table>
                            <div className='mt-4 p-0'>
                                {(localStorage.getItem('id')) ? (
                                    paymentMethod === 'COD' ? (
                                        <div class="input-group mb-5">
                                            <input type="text" class="form-control" placeholder="Chọn địa chỉ nhận hàng" aria-label="Recipient's username" aria-describedby="basic-addon2"
                                                onChange={(e) => setAddress(e.target.value)}
                                                value={address}
                                            />
                                            <div class="input-group-append">
                                                <button onClick={() => addAdress()} class="btn btn-outline-dark" type="button">Sử dụng địa chỉ mặc định</button>
                                            </div>
                                        </div>
                                    ) : null
                                ) : null}
                            </div>
                            {/* Cột bên trái (col-md-6) */}
                            <div className="col-md-6 border p-3">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="exampleRadios"
                                        id="exampleRadios1"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={() => setPaymentMethod('COD')}
                                    />
                                    <label className="form-check-label" htmlFor="exampleRadios1">
                                        Thanh toán COD
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="exampleRadios"
                                        id="exampleRadios2"
                                        value="online"
                                        checked={paymentMethod === 'Thanh toán trực tuyến'}
                                        onChange={() => setPaymentMethod('Thanh toán trực tuyến')}
                                    />
                                    <label className="form-check-label" htmlFor="exampleRadios2">
                                        Thanh toán trực tuyến
                                    </label>
                                </div>
                            </div>

                            {/* Cột bên phải (col-md-6) */}
                            <div className=" paymentButton col-md-6 border p-3 text-center" >
                                {/* Hiển thị button thành công nếu chọn phương thức thanh toán COD */}
                                {paymentMethod === 'COD' && (
                                    <button type="submit" className="btn btn-warning">
                                        Thanh toán
                                    </button>
                                )}

                                {/* Hiển thị nút PayPalButton chỉ khi chọn phương thức thanh toán trực tuyến */}
                                {paymentMethod === 'Thanh toán trực tuyến' && (
                                    <button type="submit" className="btn btn-warning">
                                        Thanh toán Paypal
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default Payment;