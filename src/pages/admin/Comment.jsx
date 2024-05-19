import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import { Table } from 'react-bootstrap';
import axios from 'axios';
import "react-toastify/dist/ReactToastify.css";

const Comment = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const { data: prodData } = await axios.get(process.env.REACT_APP_PRODUCT_API)
            setProducts(prodData)
        }
        fetchData()
    }, [])

    return (
        <div className='container'>
            <h2 className='mt-5 mb-5'>Bình luận</h2>
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center align-middle'>
                        <th>IMG</th>
                        <th>Tên sản phẩm</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((prod) => (
                        <tr key={prod._id} className="text-center align-middle">
                            <td><img class="rounded mx-auto d-block" src={prod.imageUrl} alt="" style={{ width: '80px', height: '80px' }} /></td>
                            <td>{prod.name}</td>
                            <td style={{ textAlign: 'center' }}>
                                <div>
                                    <Link className='btn btn-primary' to={`/admin/comment/${prod._id}`}>Chi tiết</Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Comment;