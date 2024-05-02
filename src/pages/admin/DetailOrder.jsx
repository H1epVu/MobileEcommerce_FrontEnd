import React, { useEffect, useState } from 'react';
import { Table, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FormatNumber } from '../../Utils';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const DetailOrder = () => {
  const navigate = useNavigate()
  const { orderId } = useParams()
  const [address, setAddress] = useState('')
  const [isModalOpen, setModalOpen] = useState(false);
  const [order, setOrder] = useState({})
  const [list, setList] = useState([])
  useEffect(() => {
    const getDetail = async () => {
      const { data: orderData } = await axios.get(process.env.REACT_APP_ORDER_API + `${orderId}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      setOrder(orderData)
      setList(orderData.order_items);
    }
    getDetail()

  }, [orderId, list])
  const checkStatus = (status) => {
    if (status === "aborted") {
      return (
        <h3 class="text-danger fw-bold">Đơn hàng đã bị hủy</h3>
      )
    } else if (status === "closed") {
      return (
        <h3 class="text-success fw-bold">Đơn hàng đã được thanh toán</h3>
      )
    }
  }
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const updateAddress = async (id) => {
    console.log(address.length);
    if (address.length < 10) {
      toast.error('Hãy nhập địa chỉ hợp lệ')
    } else {
      await axios.post(process.env.REACT_APP_ORDER_API + `update`, {
        orderId: id,
        status: 'open',
        address: address
      }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      setModalOpen(false);
    }
  }
  const cancel = async (id) => {
    await axios.post(process.env.REACT_APP_ORDER_API + `update`, {
      orderId: id,
      status: 'aborted',
      address: address
    }, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    navigate(`/admin/order/detail/${orderId}`)
  }
  const confirm = async (id) => {
    await axios.post(process.env.REACT_APP_ORDER_API + `update`, {
      orderId: id,
      status: 'closed',
      address: address
    }, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
    navigate(`/admin/order/detail/${orderId}`)
  }
  return (
    <div class="container">
      <div class="row">
        <div class="header-laptop mt-5 d-flex justify-content-between">
          <h3>Đơn hàng {orderId}</h3>
          <Link class="btn btn-danger" to={"/admin/order"}>Quay Lại</Link>
        </div>
        <div class="mt-3 col-7">
          <div class="mt-3 d-flex justify-content-between">
            <h5>Tên Khách Hàng:</h5>
            <p>{order.userName}</p>
          </div>
          <div class="mt-3 d-flex justify-content-between">
            <h5>Số Điện Thoại:</h5>
            <p>{order.userPhone}</p>
          </div>
          <div class="mt-3 d-flex justify-content-between">
            <h5>Địa Chỉ Nhận Hàng:</h5>
            <p>{order.address}</p>
          </div>
          <div class="mt-3 d-flex justify-content-between">
            <h5>Tổng Giá Trị Đơn Hàng:</h5>
            <p>{FormatNumber(String(order.total))}đ</p>
          </div>
          <div class="mt-5">
            <h5>Danh Sách Chi tiết:</h5>
          </div>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên Sản Phẩm</th>
              <th scope="col">Số Lượng</th>
              <th scope="col">Thành Tiền</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={item.product_id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{FormatNumber(String(item.price))}đ</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div class="mt-3">
          {order.status === "open" ? (
            <div class="d-flex justify-content-between">
              <button type="submit" class="btn btn-danger" onClick={() => cancel(orderId)}>Hủy Đơn Hàng</button>
              <div>
                <Button variant="primary" onClick={handleOpenModal} className='mx-3'>
                  Cập Nhật Địa Chỉ
                </Button>

                <Modal show={isModalOpen} onHide={handleCloseModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Cập Nhật</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Địa Chỉ Mới</Form.Label>
                        <Form.Control type="text" onChange={(e) => setAddress(e.target.value)} placeholder='Nhập địa chỉ mới' />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="primary" onClick={() => updateAddress(orderId)}>
                      Cập Nhật
                    </Button>
                  </Modal.Footer>
                </Modal>
                <button type="submit" class="btn btn-success" onClick={() => confirm(orderId)}>Xác Nhận Đã Thanh Toán</button>
              </div>
            </div>
          ) : null}
        </div>
        {checkStatus(order.status)}
      </div>

    </div>
  )
}

export default DetailOrder