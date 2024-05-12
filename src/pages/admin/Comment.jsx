import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from "react-router-dom"
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FormatDate } from '../../Utils';

const Comment = () => {
    const [comments, setComments] = useState([])
    const handleDelete = async (cmtId) => {
        try {
            await axios.delete(process.env.REACT_APP_COMMENT_API + `delete/${cmtId}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            const updatedComments = comments.filter(cmt => cmt._id !== cmtId);
            setComments(updatedComments);
            toast.success('Xóa bình luận thành công!')
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(process.env.REACT_APP_COMMENT_API)
            setComments(data)
        }
        fetchData()
    }, [])
    return (
        <div className='container'>
            <h2 className='mt-5 mb-5'>Bình luận</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Người dùng</th>
                        <th>Nội dung</th>
                        <th>Thời gian</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {comments.map((comment) => (
                        <tr key={comment._id}>
                            <td>{comment._id}</td>
                            <td>{comment.email}</td>
                            <td>{comment.content}</td>
                            <td>{FormatDate(comment.createdAt)}</td>
                            <td style={{ textAlign: 'center' }}>
                                <Button className="btn btn-danger" onClick={() => handleDelete(comment._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default Comment;