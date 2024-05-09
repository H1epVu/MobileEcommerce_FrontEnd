import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavScroll from '../../components/Navbar';
import CryptoJS from 'crypto-js';
import Form from 'react-bootstrap/Form';

const ChangePassword = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [updatePassword, setUpdatePassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const updateUserPassword = async (e) => {

        e.preventDefault()
        if (!updatePassword || !confirmPassword) {
            toast.error("Không được để trống");
            return
        }
        if (confirmPassword !== updatePassword) {
            toast.error("Xác nhận mật khẩu không chính xác");
            return
        }

        try {

            const { data: { token } } = await axios.post(process.env.REACT_APP_AUTH_API + `create-token`, {
                userId: id
            })

            await axios.post(process.env.REACT_APP_USER_API + `update`, {
                id: id,
                password: CryptoJS.MD5(updatePassword).toString(),
                resetToken: ''
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })

            toast.success('Đổi Mật Khẩu Thành Công');
            setUpdatePassword('')
            setConfirmPassword('')

            setTimeout(() => {
                navigate('/login')
            }, 1000)

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <NavScroll />
            <div className='forget-password'>
                <form className='form-signup w-100 m-auto' onSubmit={updateUserPassword}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nhập mật khẩu mới:</Form.Label>
                            <Form.Control type="password" placeholder="Nhập mật khẩu mới" value={updatePassword} onChange={(e) => setUpdatePassword(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Xác nhận mật khẩu:</Form.Label>
                            <Form.Control type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </Form.Group>
                    </Form>
                    <button class="btn btn-dark w-100 py-2" type="submit" >Xác nhận</button>
                </form>
            </div>
        </>
    )
}

export default ChangePassword