import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavScroll from '../../components/Navbar';
import { checkEmail, FormatString } from '../../Utils';

const ForgetPassword = () => {
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [email, setEmail] = useState('')
    const [token, setToken] = useState('')

    const handleSendEmail = async (e) => {
        e.preventDefault();
        setMessage('')
        setEmail(FormatString(email))

        try {
            if (!email) {
                setMessage("Không được để trống")
                return
            }

            if (!checkEmail(email)) {
                setMessage("Email không đúng định dạng")
                return
            }

            const { data  } = await axios.post(process.env.REACT_APP_USER_API + `find/email`, { email: email })

            if (data.message) {
                setMessage(data.message)
                return
            }

            await axios.post(process.env.REACT_APP_MAIL_API + `sendEmail`, { email: email })
            toast.success('Gửi mã thành công! Vui lòng kiểm tra email')
            setMessage('')

        } catch (error) {
            console.log(error)
            setMessage("Đã có lỗi xảy ra, vui lòng thử lại sau");
            return
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: { userId } } = await axios.post(process.env.REACT_APP_USER_API + `verify-token`, {
                email: email,
                resetToken: token
            })


            if (!userId) {
                toast.error('Mã không hợp lệ vui lòng thử lại!')
                return
            }

            navigate(`/changePassword/${userId}`)

        } catch (error) {
            console.log(error)
            setMessage("Đã có lỗi xảy ra, vui lòng thử lại sau");
            return
        }
    }
    return (
        <>
            <NavScroll />
            <div className='forget-password'>
                <form className='form-signup w-100 m-auto' onSubmit={handleSubmit}>
                    <h1 class="h3 mb-3 fw-normal">Quên mật khẩu</h1>
                    <div className='text-danger'>{message}</div>
                    <div className="row align-items-center">
                        <div className="col-sm-8">
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control"
                                    required
                                />
                                <label for="Email">Email</label>
                            </div>
                        </div>
                        <div className="col-sm-4 send-email-button">
                            <button className="btn btn-outline-dark w-100" onClick={handleSendEmail}>
                                Gửi Email
                            </button>
                        </div>
                    </div>
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control"
                            value={token}
                            onChange={(e) => { setToken(e.target.value) }}
                            required
                        />
                        <label for="Token">Mã xác nhận</label>
                    </div>
                    <button class="btn btn-dark w-100 py-2" type="submit" >Xác nhận</button>
                </form>
            </div>
        </>
    )
}

export default ForgetPassword