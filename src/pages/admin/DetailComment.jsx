import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormatDate } from '../../Utils';

const DetailComment = () => {
    const location = useLocation();
    const id = location.pathname.split('/')[3];
    const userId = localStorage.getItem('id');
    const [comments, setComments] = useState({});
    const [replies, setReplies] = useState([])
    const [replyInputs, setReplyInputs] = useState({});

    const handleReplyChange = (commentId, e) => {
        const { value } = e.target;
        setReplyInputs((prevInputs) => ({
            ...prevInputs,
            [commentId]: value,
        }));
    };

    const handleReply = async (e, commentId) => {
        e.preventDefault();
        if (replyInputs[commentId].trim() === '') {
            toast.error('Không được để bình luận trống')
            return;
        }

        await axios.post(process.env.REACT_APP_COMMENT_API + `reply/add`, {
            cmtId: commentId,
            userId: userId,
            email: 'ADMIN',
            content: replyInputs[commentId]
        }, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })

        toast.success('Đăng bình luận thành công!');
        setReplyInputs((prevInputs) => ({
            ...prevInputs,
            [commentId]: '',
        }));

        const { data } = await axios.get(process.env.REACT_APP_COMMENT_API + `prod/${id}`)
        setComments(data[0])
        setReplies(data[0].replies)

    }

    const handleDelete = async (commentId) => {
        try {
            await axios.delete(process.env.REACT_APP_COMMENT_API + `delete/${commentId}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })

            toast.success('Xóa bình luận thành công')
            Navigate('/admin/comment')
        } catch (error) {
            console.log(error)
        }
    };

    const handleDeleteReply = async (replyId, cmtId) => {
        try {
            await axios.delete(process.env.REACT_APP_COMMENT_API + `delete/${cmtId}/${replyId}`, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })

            const updatedReplies = replies.filter(reply => reply._id !== replyId);
            setReplies(updatedReplies)
            toast.success('Xóa bình luận thành công')
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(process.env.REACT_APP_COMMENT_API + `prod/${id}`)
            if (data.length > 0) {
                setComments(data[0])
                setReplies(data[0].replies)
            } else {
                setComments('')
                setReplies('')
            }
        }
        fetchData()
    }, [id])

    return (
        <>
            {comments ? (
                <div className='container'>
                    <div className='mt-5 mb-5 p-3' >
                        <h1 className='mb-4'>Bình luận</h1>
                        <div className='mb-1'>
                            <strong>{comments.email}</strong>
                        </div>
                        <div className='mb-1'>
                            <p>{comments.content}</p>
                            <small className="text-muted">Posted on: {FormatDate(comments.createdAt)}</small>
                        </div>
                        <button
                            className="btn btn-danger btn-sm mt-2 "
                            onClick={() => handleDelete(comments._id)}
                        >
                            Delete
                        </button>
                        <div>
                            {replies.map((reply) => (
                                <div className="border mt-3 mb-3 p-3">
                                    <div className='mb-1'>
                                        <strong>{reply.email}</strong>
                                    </div>
                                    <div className='mb-1'>
                                        <p>{reply.content}</p>
                                    </div>
                                    <div className='mb-1'>
                                        <small className="text-muted">Posted on: {FormatDate(reply.createdAt)}</small>
                                    </div>
                                    <button
                                        className="btn btn-danger btn-sm mt-2"
                                        onClick={() => handleDeleteReply(reply._id, comments._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div>
                            <form onSubmit={(e) => handleReply(e, comments._id)}>
                                <div className="mt-3 mb-3">
                                    <textarea
                                        className="form-control"
                                        id="commentContent"
                                        rows="3"
                                        value={replyInputs[comments._id]}
                                        onChange={(e) => handleReplyChange(comments._id, e)}
                                    ></textarea>
                                    <button type="submit" className="btn btn-primary btn-sm mt-3">Reply</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='container text-center mt-5'>
                    <h1><strong>Sản phẩm chưa có bình luận</strong></h1>
                </div>
            )}
        </>
    );
};

export default DetailComment;
