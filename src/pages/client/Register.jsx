import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavScroll from '../../components/Navbar';
import { checkEmail, checkPhone, FormatString } from '../../Utils';

const Register = () => {
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('')
        setName(FormatString(name))
        setEmail(FormatString(email))
        setPhone(FormatString(phone))
        if (!name || !email || !phone || !password) {
            setMessage("Không được để trống")
            return
        }
        if (!checkEmail(email)) {
            setMessage("Email không đúng định dạng")
            return
        }

        try {
            const { user } = await axios.get(`${process.env.REACT_APP_USER_API}find?email=${email}`)
            console.log(user)

            if (user) {
                setMessage('Email đã được đăng ký!')
                return
            }

            if (!checkPhone(phone)) {
                toast.error('Số điện thoại không hợp lệ');
                return
            }

            const newUser = {
                name: name,
                phone: phone,
                email: email,
                address: " ",
                password: CryptoJS.MD5(password).toString(),
                role: "user"
            };

            await axios.post(process.env.REACT_APP_USER_API + `register`, newUser)

            toast.success('Đăng ký thành công')
            setTimeout(() => {
                navigate('/login')
            }, 1000);

        } catch (error) {
            console.log(error)
            setMessage("Đã có lỗi xảy ra, vui lòng thử lại sau");
            return
        }
    }
    return (
        <>
            <NavScroll />
            <div className='register'>
                <form className='form-signup w-100 m-auto' onSubmit={handleSubmit}>
                    <h1 class="h3 mb-3 fw-normal">Đăng Ký</h1>
                    <div className='text-danger'>{message}</div>
                    <div class="form-floating">
                        <input type="text" value={name} onChange={(e) => { setName(e.target.value) }} class="form-control" id="Name" required />
                        <label for="Name">Họ Và Tên</label>
                    </div>
                    <div class="form-floating">
                        <input type="text" value={phone} onChange={(e) => { setPhone(e.target.value) }} class="form-control" id="Phone" required />
                        <label for="Phone">Số Điện Thoại</label>
                    </div>
                    <div class="form-floating">
                        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }} class="form-control" id="Email" required />
                        <label for="Email">Email</label>
                    </div>
                    <div class="form-floating">
                        <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} class="form-control" id="Password" required />
                        <label for="Password">Mật Khẩu</label>
                    </div>
                    <button class="btn btn-dark w-100 py-2" type="submit" >Đăng Ký</button>
                    <span>Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </span>
                </form>
            </div>
        </>
    )
}

export default Register