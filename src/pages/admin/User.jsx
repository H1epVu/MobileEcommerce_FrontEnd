import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';

const User = () => {
    const [users, setUsers] = useState([])
    const [searchId, setSearchId] = useState('');

    const deleteUser = async (id) => {
        await axios.delete(process.env.REACT_APP_USER_API + `delete/${id}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        const updateUser = users.filter(user => user._id !== id);
        setUsers(updateUser)
        toast.success('Xóa Thành Công')
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const { data: user } = await axios.get(process.env.REACT_APP_USER_API + `${searchId}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            });
            setUsers(user);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleInputChange = (e) => {
        setSearchId(e.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data: userData } = await axios.get(process.env.REACT_APP_USER_API, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            setUsers(userData)
        }
        fetchData()
    }, [])
    return (
        <div className='container'>
            <h2 className='mt-5 mb-5'>Người Dùng</h2>
            <div className="search-bar mb-4">
                <form className="form-inline my-2 my-lg-0" onSubmit={handleSearch}>
                    <div className="d-flex">
                        <input className="form-control mr-sm-2" type="search" placeholder="Nhập id người dùng" aria-label="Search" value={searchId} onChange={handleInputChange} />
                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit"><i class="bi bi-search"></i></button>
                    </div>
                </form>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Role</th>
                        <th className='d-flex justify-content-center'><Link to={'/admin/user/add'} className='btn btn-outline-success'>Thêm</Link></th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(users) ? (
                        users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.address}</td>
                                <td>{user.role}</td>
                                <td style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Link to={`/admin/user/update/${user._id}`} className='btn btn-primary mx-3'>Chỉnh sửa</Link>{' '}
                                    <Button onClick={() => deleteUser(user._id)} variant="danger">Xóa</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr key={users._id}>
                            <td>{users._id}</td>
                            <td>{users.name}</td>
                            <td>{users.email}</td>
                            <td>{users.phone}</td>
                            <td>{users.address}</td>
                            <td>{users.role}</td>
                            <td style={{ display: 'flex', justifyContent: 'center' }}>
                                <Link to={`/admin/user/update/${users._id}`} className='btn btn-primary mx-3'>Chỉnh sửa</Link>{' '}
                                <Button onClick={() => deleteUser(users._id)} variant="danger">Xóa</Button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default User;