import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

function NavScroll() {
    const navigate = useNavigate()
    const [id, setId] = useState(null)
    const login = () => {
        navigate('/login')
    }
    const register = () => {
        navigate('/register')
    }
    const logout = () => {
        localStorage.clear();
        navigate('/')
        window.location.reload();
    }
    useEffect(() => {
        setId(localStorage.getItem('id'))
    }, [])

    return (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <div className="container">
                <div className="collapse navbar-collapse d-lg-flex" id="navbarCollapse">
                    <a className="navbar-brand col-lg-3 me-0" href="/">Mobile Ecommerce</a>
                    <ul className="navbar-nav col-lg-6 justify-content-lg-center">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Trang Chủ</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/cart" className="nav-link">Giỏ Hàng</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/profile" className="nav-link">Tài khoản</Link>
                        </li>
                    </ul>
                    {!id ? (
                        <div className="d-lg-flex col-lg-3 justify-content-lg-end">
                            <button className="btn btn-light" onClick={login}>Đăng nhập</button>
                            <button className="btn btn-light ms-2" onClick={register}>Đăng ký</button>
                        </div>
                    ) : (
                        <div className="d-lg-flex col-lg-3 justify-content-lg-end" onClick={logout}>
                            <button className="btn btn-danger">Đăng xuất</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavScroll;