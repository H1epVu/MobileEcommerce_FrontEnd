// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const UserDetail = () => {
//     const navigate = useNavigate()
//     const id = localStorage.getItem('id')
//     const [user, setUser] = useState([])
//     try {
//         useEffect(() => {
//             const fetchData = async (id) => {
//                 const { data: currentUser } = await axios.get(process.env.REACT_APP_USER_API + `/${id}`)
//                 setUser(currentUser)
//             }
//             fetchData(id)
//         }, [id])

//         return (
//             <>
//                 <div className="container py-5 mt-5">
//                     <div className="row">
//                         <div className="col-lg-4">
//                             <div className="card mb-4">
//                                 <div className="card-body text-center" style={{ paddingBottom: "7px" }}>
//                                     <img src="/image/user.png" alt="avatar"
//                                         className="rounded-circle img-fluid" style={{ width: "150px" }} />
//                                     <h5 className="my-3">{user.name}</h5>
//                                     <div className="d-flex justify-content-center mb-2">
//                                         <button type="button" className="btn btn-primary">Cập nhật thông tin</button>
//                                         <button type="button" className="btn btn-danger ms-1">Đóng tài khoản</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="col-lg-8">
//                             <div className="card mb-4">
//                                 <div className="card-body">
//                                     <div className="row">
//                                         <div className="col-sm-3">
//                                             <p className="mb-0">Họ Và Tên</p>
//                                         </div>
//                                         <div className="col-sm-9">
//                                             <p className="text-muted mb-0">{user.name}</p>
//                                         </div>
//                                     </div>
//                                     <hr />
//                                     <div className="row">
//                                         <div className="col-sm-3">
//                                             <p className="mb-0">Email</p>
//                                         </div>
//                                         <div className="col-sm-9">
//                                             <p className="text-muted mb-0">{user.email}</p>
//                                         </div>
//                                     </div>
//                                     <hr />
//                                     <div className="row">
//                                         <div className="col-sm-3">
//                                             <p className="mb-0">Số điện thoại</p>
//                                         </div>
//                                         <div className="col-sm-9">
//                                             <p className="text-muted mb-0">{user.phone}</p>
//                                         </div>
//                                     </div>
//                                     <hr />
//                                     <div className="row">
//                                         <div className="col-sm-3">
//                                             <p className="mb-0">Địa chỉ</p>
//                                         </div>
//                                         <div className="col-sm-9">
//                                             <p className="text-muted mb-0">{user.address}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="card">
//                         <h3 className='mt-3 mb-3'>Đơn hàng đã đặt:</h3>
//                         <table class="table">
//                             <thead>
//                                 <tr>
//                                     <th>Firstname</th>
//                                     <th>Lastname</th>
//                                     <th>Email</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 <tr>
//                                     <td>John</td>
//                                     <td>Doe</td>
//                                     <td>john@example.com</td>
//                                 </tr>
//                                 <tr>
//                                     <td>Mary</td>
//                                     <td>Moe</td>
//                                     <td>mary@example.com</td>
//                                 </tr>
//                                 <tr>
//                                     <td>July</td>
//                                     <td>Dooley</td>
//                                     <td>july@example.com</td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </>

//         )
//     } catch (error) {
//         navigate('/login')
//     }
// }

// export default UserDetail