import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const checkPhone = (phoneNumber) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phoneNumber);
}
const AddUser = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: user } = await axios.post(process.env.REACT_APP_USER_API + `login`, {
      email: email,
      password: CryptoJS.MD5(password).toString()
    })
    if (!user) {
      toast.error('Email đã được đăng ký')
    } else if (checkPhone(phone)) {
      await axios.post(process.env.REACT_APP_USER_API + `register`, {
        name: name,
        phone: phone,
        email: email,
        address: address,
        password: CryptoJS.MD5(password).toString(),
        role: role
      })
      toast.success('Đăng ký thành công')
      setEmail('')
      setName('')
      setPassword('')
      setPhone('')
      setAddress('')
    } else {
      toast.error('Số điện thoại không đúng định dạng')
    }
  }
  return (
    <div class="container">
      <div class="row">
        <div class="header-laptop mt-5 d-flex justify-content-between">
          <h3>Thêm Người Dùng</h3>
          <Link class="btn btn-danger" to={'/admin/user'}>Quay Lại</Link>
        </div>
        <div class="mt-3">
          <form onSubmit={handleSubmit}>
            <div class="col">
              <div class="col-md-6" style={{width: "100%"}}>
                <div class="form-group">
                  <label class="control-label mt-3 mb-3">Tên:</label>
                  <input type="text" class="form-control" value={name} onChange={(e) => { setName(e.target.value) }} required />
                </div>
                <div class="form-group">
                  <label class="control-label mt-3 mb-3">Số Điện Thoại:</label>
                  <input type="text" class="form-control" value={phone} onChange={(e) => { setPhone(e.target.value) }} required />
                </div>
                <div class="form-group">
                  <label class="control-label mt-3 mb-3">Email:</label>
                  <input type="email" class="form-control" value={email} onChange={(e) => { setEmail(e.target.value) }} required />
                </div>
                <div class="form-group">
                  <label class="control-label mt-3 mb-3">Địa Chỉ:</label>
                  <input type="text" class="form-control" value={address} onChange={(e) => { setAddress(e.target.value) }} required />
                </div>
                <div class="form-group">
                  <label class="control-label mt-3 mb-3">Mật Khẩu:</label>
                  <input type="password" class="form-control" value={password} onChange={(e) => { setPassword(e.target.value) }} required />
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-group">
                  <label class="mt-3 mb-3" for="Status">Phân Quyền:</label>
                  <select class="form-control mb-3" onChange={(e) => { setRole(e.target.value) }}>
                    <option value={'user'}>Người Dùng</option>
                    <option value={'admin'}>Quản Trị Viên</option>
                  </select>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-group d-flex justify-content-end">
                  <button class="btn btn-success float-right" type="submit">
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddUser