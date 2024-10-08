import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/reducers/cart-reducer';
import NavScroll from '../../components/Navbar';
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import queryString from 'query-string';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.shoppingCart.cartItems);
    
    const url = window.location.href;
    const parsed = queryString.parseUrl(url);
    const { paymentId, PayerID } = parsed.query;

    useEffect(() => {
        const handlePaymentSuccess = async () => {
            const userId = localStorage.getItem('id');

            if (userId) {
                try {
                    const { data } = await axios.get(process.env.REACT_APP_USER_API + `${userId}`, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    });

                    const userName = data.name;
                    const userPhone = data.phone;
                    const paymentTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

                    const { data: { payment: paymentData } } = await axios.get(process.env.REACT_APP_PAYMENT_API + `success?paymentId=${paymentId}&PayerId=${PayerID}`);

                    const paymentMethod = paymentData.payer.payment_method;
                    const address = paymentData.payer.payer_info.shipping_address.line1 + ", " + paymentData.payer.payer_info.shipping_address.city;

                    await axios.post(process.env.REACT_APP_ORDER_API + `add`, {
                        cartItems: cartItems,
                        total: paymentTotal,
                        userId: userId,
                        userName: userName,
                        userPhone: userPhone,
                        address: address,
                        paymentMethod: paymentMethod
                    }, {
                        headers: {
                            Authorization: 'Bearer ' + localStorage.getItem('token')
                        }
                    });

                    await Promise.all(cartItems.map(item =>
                        axios.post(process.env.REACT_APP_PRODUCT_API + `updateQuantity`, {
                            id: item.id,
                            quantity: -item.quantity
                        }, {
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('token')
                            }
                        })
                    ));

                    dispatch(clearCart());
                    toast.success('Đặt hàng thành công');
                } catch (error) {
                    console.log(error);
                    toast.error('Có lỗi xảy ra khi xử lý đơn hàng.');
                }
            } else {
                navigate('/NotFound');
            }
        };

        handlePaymentSuccess();
    }, [cartItems, navigate, dispatch, paymentId, PayerID]);

    return (
        <>
            <NavScroll />
            <div className='paymentSuccess'>
                <div className='success'>
                    <i className="bi bi-bag-check"></i>
                    <p>Cảm ơn quý khách đã đặt hàng</p>
                    <Link className='btn btn-outline-dark' to='/'>Tiếp tục mua sắm</Link>
                </div>
            </div>
        </>
    );
};

export default PaymentSuccess;