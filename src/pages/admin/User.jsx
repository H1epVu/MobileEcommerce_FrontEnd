import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from 'react-router-dom';

const User = () => {
    const [users, setUsers] = useState([])
    const deleteUser = async (id) => {
        await axios.delete(process.env.REACT_APP_USER_API + `delete/${id}`)
        const updateUser = users.filter(user => user._id !== id);
        setUsers(updateUser)
        toast.success('Xóa Thành Công')
    }
    useEffect(() => {
        const fetchData = async () => {
            const { data: {users: userData}} = await axios.get(process.env.REACT_APP_USER_API)
            setUsers(userData)
        }
        fetchData()
    }, [])
    return (
        <div className='container'>
            <h2 className='mt-5 mb-5'>Người Dùng</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Role</th>
                        <th className='d-flex justify-content-center'><Link to={'/admin/user/add'} className='btn btn-success'>Add User</Link></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.address}</td>
                            <td>{user.role}</td>
                            <td style={{ display: 'flex', justifyContent: 'center' }}>
                                <Link to={`/admin/user/update/${user._id}`} className='btn btn-primary mx-3'>Edit</Link>{' '}
                                <Button onClick={() => deleteUser(user._id)} variant="danger">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default User;