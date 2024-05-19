import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css";
import { FormatNumber } from '../../Utils';

const HomeAdmin = () => {
    const [total, setTotal] = useState('')
    const [totalOrders, setTotalOrders] = useState('')
    const [totalProds, setTotalProds] = useState('')
    const [totalUsers, setTotalUsers] = useState('')
    const [openOrders, setOpenOrders] = useState('')

    const countOrders = async () => {
        const { data: orders } = await axios.get(process.env.REACT_APP_ORDER_API, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        const totalOrders = orders.length
        setTotalOrders(totalOrders)

        let totalIncome = orders.reduce((sum, item) => {
            if (item.status === "closed") {
                return sum + item.total;
            }
            return sum;
        }, 0);
        setTotal(totalIncome)

    }

    const countProducts = async () => {
        const { data: prod } = await axios.get(process.env.REACT_APP_USER_API, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        const prods = prod.length
        setTotalProds(prods)
    }

    const countUsers = async () => {
        const { data: users } = await axios.get(process.env.REACT_APP_USER_API, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        const totalUsers = users.length - 1
        setTotalUsers(totalUsers)
    }

    const countOpenOrders = async () => {
        const { data: openOrders } = await axios.get(process.env.REACT_APP_ORDER_API + `status`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            },
            params: {
                status: 'open'
            }
        })
        let total = openOrders.length
        setOpenOrders(total)
    }

    useEffect(() => {
        countOrders()
        countProducts()
        countUsers()
        countOpenOrders()
    }, [])

    return (
        <>
            <div class="container">
                <div className='m-5 text-center align-middle'> <h1><strong>DASHBOARD</strong></h1></div>
                <div class="row pt-3">
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title"><strong>Tổng doanh thu</strong></h5>
                                <p class="card-text">{FormatNumber(total)} đ</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title"><strong>Tổng sản phẩm</strong></h5>
                                <p class="card-text">{totalProds} sản phẩm</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title"><strong>Tổng đơn hàng</strong></h5>
                                <p class="card-text">{totalOrders} đơn hàng</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title"><strong>Tổng người dùng</strong></h5>
                                <p class="card-text">{totalUsers} người</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="container mt-4 p-0">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header">
                                    <h5><strong>
                                        Doanh thu
                                    </strong></h5>
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Doanh thu theo tuần</h5>
                                    <p class="card-text">1000 USD</p>
                                    <h5 class="card-title">Doanh thu theo tháng</h5>
                                    <p class="card-text">4000 USD</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header">
                                    <h5><strong>
                                        Đơn hàng
                                    </strong></h5>
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Đơn hàng chưa xử lý</h5>
                                    <p class="card-text">20 đơn hàng</p>
                                    <h5 class="card-title">Đơn hàng mới theo ngày</h5>
                                    <p class="card-text">5 đơn hàng mới</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeAdmin;