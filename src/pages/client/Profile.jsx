import React, { useEffect, useState } from 'react'
import CryptoJS from 'crypto-js'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavScroll from '../../components/Navbar';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { toast } from "react-toastify";
import { checkEmail, checkPhone, FormatNumber, checkOrderStatus, FormatDate, FormatString } from '../../Utils';
import "react-toastify/dist/ReactToastify.css";

const UserDetail = () => {
    const navigate = useNavigate()
    const id = localStorage.getItem('id')
    // modals
    const [showInfo, setShowInfo] = useState(false);
    const handleCloseInfo = () => setShowInfo(false);
    const handleShowInfo = () => setShowInfo(true);
    const [showPassword, setShowPassword] = useState(false);
    const handleClosePassword = () => setShowPassword(false);
    const handleShowPassword = () => setShowPassword(true);
    const [showOrder, setShowOrder] = useState(false);
    const handleCloseOrder = () => setShowOrder(false);
    const handleShowOrder = () => setShowOrder(true);

    // data
    const [user, setUser] = useState({})
    const [orders, setOrders] = useState([])
    const [currentOrderId, setCurrentOrderId] = useState()
    const [orderDetail, setOrderDetail] = useState({})
    const [orderProduct, setOrderProduct] = useState([])
    const [updateName, setUpdateName] = useState('')
    const [updateEmail, setUpdateEmail] = useState('')
    const [updateAddress, setUpdateAddress] = useState('')
    const [updatePhone, setUpdatePhone] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [updatePassword, setUpdatePassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const updateUserInfo = async (e) => {
        e.preventDefault()
        setUpdateName(FormatString(updateName))
        setUpdateAddress(FormatString(updateAddress))
        setUpdateEmail(FormatString(updateEmail))
        setUpdatePhone(FormatString(updatePhone))
        if (!updateName || !updateEmail || !updatePhone || !updateAddress) {
            toast.error("Không được để trống");
            return
        }
        if (!checkPhone(updatePhone)) {
            toast.error("Hãy nhập số điện thoại hợp lệ");
            return
        }
        if (!checkEmail(updateEmail)) {
            toast.error("Hãy nhập email hợp lệ");
            return
        }
        if (updateAddress.trim().length < 5) {
            toast.error("Hãy nhập địa chỉ hợp lệ");
            return
        }
        const { data } = await axios.post(process.env.REACT_APP_USER_API + `find/email`, {
            email: updateEmail,
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        console.log(data)

        if (data._id !== id) {
            toast.error('Email đã được đăng ký')
        } else {
            await axios.post(process.env.REACT_APP_USER_API + `update`, {
                id: id,
                name: updateName,
                phone: updatePhone,
                email: updateEmail,
                address: updateAddress
            }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            const { data: currentUser } = await axios.get(process.env.REACT_APP_USER_API + `${id}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            setUser(currentUser)
            toast.success('Cập Nhật Thành Công')
            handleCloseInfo()
        }
    }
    const updateUserPassword = async (e) => {
        e.preventDefault()
        if (!updatePassword || !currentPassword || !confirmPassword) {
            toast.error("Không được để trống");
            return
        }
        if (CryptoJS.MD5(currentPassword).toString() !== user.password) {
            console.log(CryptoJS.MD5(currentPassword).toString())
            toast.error("Mật khẩu hiện tại không chính xác");
            return
        }
        if (confirmPassword !== updatePassword) {
            toast.error("Xác nhận mật khẩu không chính xác");
            return
        } else {
            await axios.post(process.env.REACT_APP_USER_API + `update`, {
                id: id,
                password: CryptoJS.MD5(updatePassword).toString()
            }, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            const { data: currentUser } = await axios.get(process.env.REACT_APP_USER_API + `${id}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            setUser(currentUser)
            toast.success('Đổi Mật Khẩu Thành Công');
            setUpdatePassword('')
            setCurrentPassword('')
            setConfirmPassword('')
            handleClosePassword()
        }
    }
    const fetchDataModal = async (e, orderId) => {
        e.preventDefault()
        setCurrentOrderId(orderId)
        const { data: detailOrder } = await axios.get(process.env.REACT_APP_ORDER_API + `${orderId}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        setOrderDetail(detailOrder)
        setOrderProduct(detailOrder.order_items)
        handleShowOrder()
    }
    const cancelOrder = async () => {
        await axios.post(process.env.REACT_APP_ORDER_API + `update`, {
            orderId: currentOrderId,
            status: 'aborted'
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        const { data: currentOrders } = await axios.get(process.env.REACT_APP_ORDER_API + `user/${id}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        setOrders(currentOrders)
        toast.success("Hủy Đơn Hàng Thành Công")
        handleCloseOrder()
    }
    const displayStatus = (status) => {
        if (status === "open") {
            return (<Button variant="danger" onClick={() => cancelOrder()}>Hủy Đơn Hàng</Button>)
        } else if (status === "aborted") {
            return (<h5 className="text-danger">Đơn Hàng Đã Bị Hủy</h5>)
        } else {
            return (<h5 className="text-success">Đơn Hàng Đã Thanh Toán</h5>)
        }
    }
    useEffect(() => {
        const fetchData = async (id) => {
            if (!id) {
                navigate("/login")
            } else {
                const { data: currentUser } = await axios.get(process.env.REACT_APP_USER_API + `${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                const { data: currentOrders } = await axios.get(process.env.REACT_APP_ORDER_API + `user/${id}`, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                setUser(currentUser)
                setOrders(currentOrders)
                setUpdateName(currentUser.name)
                setUpdateEmail(currentUser.email)
                setUpdatePhone(currentUser.phone)
                setUpdateAddress(currentUser.address)
            }
        }
        fetchData(id)
    }, [id, navigate])

    return (
        <>
            <NavScroll />
            <div className="container py-5 mt-5">
                <div className="row">
                    <div className="col-lg-4">
                        <div className="card mb-4" style={{ height: "300px" }}>
                            <div className="card-body text-center" style={{ paddingBottom: "7px" }}>
                                <img src="/image/user.png" alt="avatar"
                                    className="rounded-circle img-fluid" style={{ width: "150px" }} />
                                <h5 className="my-3">{user.name}</h5>
                                <div className="d-flex justify-content-center mb-2">
                                    <button type="button" className="btn btn-primary ms-1" onClick={handleShowInfo}>Cập nhật thông tin</button>
                                    <Modal show={showInfo} onHide={handleCloseInfo} animation={true} centered>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Cập nhật thông tin</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Họ Và Tên:</Form.Label>
                                                    <Form.Control type="text" placeholder="Nhập họ và tên" value={updateName} onChange={(e) => setUpdateName(e.target.value)} />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Email:</Form.Label>
                                                    <Form.Control type="email" placeholder="Nhập email" value={updateEmail} onChange={(e) => setUpdateEmail(e.target.value)} />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Số Điện Thoại:</Form.Label>
                                                    <Form.Control type="text" placeholder="Nhập số điện thoại" value={updatePhone} onChange={(e) => setUpdatePhone(e.target.value)} />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Địa Chỉ Mặc Định:</Form.Label>
                                                    <Form.Control type="text" placeholder="Nhập địa chỉ" value={updateAddress} onChange={(e) => setUpdateAddress(e.target.value)} />
                                                </Form.Group>
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="success" onClick={(e) => updateUserInfo(e)}>
                                                Cập Nhật
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                    <button type="button" className="btn btn-primary ms-1" onClick={handleShowPassword}>Đổi mật khẩu</button>
                                    <Modal show={showPassword} onHide={handleClosePassword} animation={true} centered>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Đổi Mật Khẩu</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Nhập mật khẩu:</Form.Label>
                                                    <Form.Control type="password" placeholder="Nhập mật khẩu hiện tại" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Nhập mật khẩu mới:</Form.Label>
                                                    <Form.Control type="password" placeholder="Nhập mật khẩu mới" value={updatePassword} onChange={(e) => setUpdatePassword(e.target.value)} />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Xác nhận mật khẩu:</Form.Label>
                                                    <Form.Control type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                                </Form.Group>
                                            </Form>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="success" onClick={(e) => updateUserPassword(e)}>
                                                Đổi mật khẩu
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="card mb-4" style={{ height: "300px" }}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Họ Và Tên</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{user.name}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Email</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{user.email}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Số điện thoại</p>
                                    </div>
                                    <div className="col-sm-9">
                                        <p className="text-muted mb-0">{user.phone}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="row">
                                    <div className="col-sm-3">
                                        <p className="mb-0">Địa chỉ mặc định</p>
                                    </div>
                                    <div className="col-sm-9">
                                        {(user.address === " ") ? (
                                            <p className="text-muted mb-0">Hãy cập nhật địa chỉ mặc định</p>
                                        ) : (
                                            <p className="text-muted mb-0">{user.address}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(orders.length === 0) ? (
                        <div className='mt-5 d-flex justify-content-center'>
                            <h3>Bạn Chưa Có Đơn Hàng Hãy Đặt Hàng Nhé</h3>
                        </div>
                    ) : (
                        <div className='mt-5'>
                            <h3 className='mb-3'>Đơn hàng đã đặt:</h3>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Mã Đơn Hàng</th>
                                        <th>Tổng Giá Trị</th>
                                        <th>Tình Trạng</th>
                                        <th>Thời Gian Đặt Hàng</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{FormatNumber(order.total)}đ</td>
                                            <td>{checkOrderStatus(order.status)}</td>
                                            <td>{FormatDate(order.orderDate)}</td>
                                            <td style={{ display: 'flex', justifyContent: 'center' }}>
                                                <Button variant='primary' onClick={(e) => fetchDataModal(e, order._id)}>Chi Tiết</Button>
                                                <Modal size="lg" show={showOrder} onHide={handleCloseOrder}>
                                                    <Modal.Header closeButton>
                                                        <Modal.Title> Đơn Hàng {currentOrderId}</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <div className="mt-3 d-flex justify-content-between">
                                                            <h5>Người Nhận Hàng:</h5>
                                                            <p>{orderDetail.userName}</p>
                                                        </div>
                                                        <div className="mt-3 d-flex justify-content-between">
                                                            <h5>Số Điện Thoại:</h5>
                                                            <p>{orderDetail.userPhone}</p>
                                                        </div>
                                                        <div className="mt-3 d-flex justify-content-between">
                                                            <h5>Địa Chỉ Nhận Hàng:</h5>
                                                            <p>{orderDetail.address}</p>
                                                        </div>
                                                        <div className="mt-3 d-flex justify-content-between">
                                                            <h5>Tổng Giá Trị Đơn Hàng:</h5>
                                                            <p>{FormatNumber(String(orderDetail.total))}đ</p>
                                                        </div>
                                                        <div className="mt-3">
                                                            <h5>Danh Sách Chi tiết:</h5>
                                                        </div>
                                                        <Table striped bordered hover className='mt-3'>
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">STT</th>
                                                                    <th scope="col">Tên Sản Phẩm</th>
                                                                    <th scope="col">Số Lượng</th>
                                                                    <th scope="col">Thành Tiền</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {orderProduct.map((item, index) => (
                                                                    <tr key={item._id}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{item.name}</td>
                                                                        <td>{item.quantity}</td>
                                                                        <td>{FormatNumber(String(item.price))}đ</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </Modal.Body>
                                                    <Modal.Footer className='d-flex justify-content-center'>{displayStatus(orderDetail.status)}</Modal.Footer>
                                                </Modal>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default UserDetail