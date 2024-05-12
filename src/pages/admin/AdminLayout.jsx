import React, { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const navigate = useNavigate()
    const role = localStorage.getItem('role')
    const logout = () => {
        localStorage.removeItem('id');
        localStorage.removeItem('role');
        navigate('/')
        window.location.reload();
    }
    useEffect(() => {
        if (role !== "admin") {
            navigate('/notfound')
        }
    }, [role, navigate])
    return (
        <main className="d-flex flex-nowrap">
            <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{ width: "280px" }}>
                <h2 className='d-flex justify-content-center'>ADMIN</h2>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li class="nav-item">
                        <NavLink to={'/admin/mobile'} className="nav-link" activeClassName="active" style={{color: "white"}}>Sản Phẩm</NavLink >
                    </li>
                    <li class="nav-item">
                        <NavLink to={'/admin/user'} className="nav-link" activeClassName="active" style={{color: "white"}}>Người Dùng</NavLink >
                    </li>
                    <li class="nav-item">
                        <NavLink to={'/admin/order'} className="nav-link" activeClassName="active" style={{color: "white"}}>Đơn Hàng</NavLink >
                    </li>
                    <li class="nav-item">
                        <NavLink to={'/admin/comment'} className="nav-link" activeClassName="active" style={{color: "white"}}>Bình luận</NavLink >
                    </li>
                </ul>
                <hr />
                <div onClick={logout}>
                    <button style={{width: "100%"}} class="btn btn-danger">Đăng xuất</button>
                </div>
            </div>
            <div className="b-example-vr"></div>
            <Outlet />
        </main>
    )
}

export default AdminLayout