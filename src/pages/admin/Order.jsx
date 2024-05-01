import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FormatDate, FormatNumber, checkOrderStatus } from "../../Utils";

const Order = () => {
  const [orders, setOrders] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const { data: { orders: ordersData } } = await axios.get(process.env.REACT_APP_ORDER_API)
      setOrders(ordersData)
    }
    fetchData()
  }, [])

  return (
    <div class="container">
      <h2 className='mt-5 mb-5'>Đơn Hàng</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Mã Đơn Hàng</th>
            <th>Tên Khách Hàng</th>
            <th>Tổng Giá Trị</th>
            <th>Tình Trạng</th>
            <th>Ngày Đặt Hàng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.userName}</td>
              <td>{FormatNumber(order.total)}đ</td>
              <td>{checkOrderStatus(order.status)}</td>
              <td>{FormatDate(order.orderDate)}</td>
              <td style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to={`/admin/order/detail/${order._id}`} className='btn btn-primary'>Chi Tiết</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Order