import React from 'react';
import { Link } from 'react-router-dom';
import NavScroll from '../../components/Navbar';
import "react-toastify/dist/ReactToastify.css";


const PaymentSuccess = () => {
    return (
        <>
            <NavScroll />
            <div className='paymentSuccess'>
                <div className='success'>
                    <i class="bi bi-bag-check"></i>
                    <p>Đơn hàng đã bị hủy</p>
                    <Link className='btn btn-outline-dark' to='/cart'>Thử lại</Link>
                </div>
            </div>
        </>
    );
};

export default PaymentSuccess;