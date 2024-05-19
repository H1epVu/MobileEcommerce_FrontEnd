import React, { useEffect, useState } from 'react';
import { Table, Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FormatDate, FormatNumber, checkOrderStatus } from "../../Utils";

const Order = () => {
  const [orders, setOrders] = useState([])
  const [searchId, setSearchId] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data: order } = await axios.get(process.env.REACT_APP_ORDER_API + `${searchId}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
      setOrders(order);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    setSearchId(e.target.value);
  };

  const handleSortChange = async (option) => {
    try {
      const { data: orders } = await axios.get(process.env.REACT_APP_ORDER_API + `status`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        params: {
          status: option
        }
      })
      setOrders(orders)
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: ordersData } = await axios.get(process.env.REACT_APP_ORDER_API, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      setOrders(ordersData)
    }
    fetchData()
  }, [])

  return (
    <div class="container">
      <h2 className='mt-5 mb-5'>Đơn Hàng</h2>
      <div className="search-bar mb-4">
        <form className="form-inline my-2 my-lg-0" onSubmit={handleSearch}>
          <div className="d-flex">
            <input className="form-control mr-sm-2" type="search" placeholder="Nhập mã đơn hàng" aria-label="Search" value={searchId} onChange={handleInputChange} />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit"><i class="bi bi-search"></i></button>
          </div>
        </form>
      </div>
      <div className="order-sort-dropdown mb-4">
        <DropdownButton id="order-sort-dropdown" title="Trạng thái">
          <Dropdown.Item onClick={() => handleSortChange('open')}>Chờ xử lý</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange('closed')}>Đã hoàn thành</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSortChange('aborted')}>Đã hủy</Dropdown.Item>
        </DropdownButton>
      </div>
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
          {Array.isArray(orders) ? (
            orders.map((order) => (
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
            ))
          ) : (
            <tr key={orders._id}>
              <td>{orders._id}</td>
              <td>{orders.userName}</td>
              <td>{FormatNumber(orders.total)}đ</td>
              <td>{checkOrderStatus(orders.status)}</td>
              <td>{FormatDate(orders.orderDate)}</td>
              <td style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to={`/admin/order/detail/${orders._id}`} className='btn btn-primary'>Chi Tiết</Link>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default Order