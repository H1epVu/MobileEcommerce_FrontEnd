import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/reducers/cart-reducer';
import axios from 'axios';
import NavScroll from '../../components/Navbar';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormatNumber, FormatDate } from '../../Utils';
import { Link } from "react-router-dom";

const Detail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location.pathname.split('/')[2];
  const userId = localStorage.getItem('id');
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyInputs, setReplyInputs] = useState({});

  const handleReplyChange = (commentId, e) => {
    const { value } = e.target;
    setReplyInputs((prevInputs) => ({
      ...prevInputs,
      [commentId]: value,
    }));
  };

  const handleAddQuantity = () => {
    setQuantity(quantity + 1)
  }
  const handleMinusQuantity = () => {
    if (quantity === 1) {
      toast.error("Số lượng phải lớn hơn 1")
    } else {
      setQuantity(quantity - 1)
    }
  }
  const handleAddToCart = () => {
    const newItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
    };

    dispatch(addToCart(newItem));
    toast.success(`Đã Thêm ${quantity} ${product.name} Vào Giỏ Hàng`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === '') {
      toast.error('Không được để bình luận trống')
      return;
    }
    const { data: { email } } = await axios.get(process.env.REACT_APP_USER_API + `${userId}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })

    await axios.post(process.env.REACT_APP_COMMENT_API + `add`, {
      userId: userId,
      prodId: id,
      email: email,
      content: newComment
    }, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })

    toast.success('Đăng bình luận thành công!');
    setNewComment('');

    const { data: comments } = await axios.get(process.env.REACT_APP_COMMENT_API + `${id}`)
    setComments(comments)
  };

  const handleReply = async (e, commentId) => {
    e.preventDefault();
    if (replyInputs[commentId].trim() === '') {
      toast.error('Không được để bình luận trống')
      return;
    }

    const { data: { email } } = await axios.get(process.env.REACT_APP_USER_API + `${userId}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })

    await axios.post(process.env.REACT_APP_COMMENT_API + `reply/add`, {
      cmtId: commentId,
      userId: userId,
      email: email,
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
    
    const { data: comments } = await axios.get(process.env.REACT_APP_COMMENT_API + `${id}`)
    setComments(comments)
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data: product } = await axios.get(process.env.REACT_APP_PRODUCT_API + `detail/${id}`)
      setProduct(product)

      const { data: comments } = await axios.get(process.env.REACT_APP_COMMENT_API + `${id}`)
      setComments(comments)

    }
    fetchData()
  }, [id])

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(process.env.REACT_APP_COMMENT_API + `delete/${commentId}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      const updatedComment = comments.filter(comment => comment._id !== commentId);
      setComments(updatedComment)
      toast.success('Xóa bình luận thành công')
    } catch (error) {
      console.log(error)
    }
  };

  const status = (status) => {
    if (status === "0") {
      return (
        <button
          className="btn btn-outline-dark flex-shrink-0"
          type="button"
          disabled
        >
          <i className="bi-cart-fill me-1"></i>
          Hết Hàng
        </button>
      )
    } else {
      return (
        <div className="d-flex">
          <button className='btn btn-outline-dark mx-3' onClick={handleMinusQuantity}> - </button>
          <div className="form-control text-center me-3">{quantity}</div>
          <button className='btn btn-outline-dark' onClick={handleAddQuantity}> + </button>
          < button
            className="btn btn-outline-dark flex-shrink-0 mx-5"
            type="button"
            onClick={handleAddToCart}
          >
            <i className="bi-cart-fill me-1"></i>
            Thêm vào giỏ hàng
          </button >
        </div>
      )
    }
  }
  return (
    <>
      <NavScroll />
      <div className="detail py-5">
        <section className="py-5">
          <div className="container px-4 px-lg-5 my-5 py-5">
            <div className="row gx-4 gx-lg-5 align-items-center py-5">
              <div className="col-md-6">
                <img className="card-img-top mb-5 mb-md-0" src={product.imageUrl} alt="..." />
              </div>
              <div className="col-md-6">
                <h1 className="display-5 fw-bolder">{product.name}</h1>
                <div className="fs-5 mb-5">
                  <span>{FormatNumber(String(product.price))} đ</span>
                </div>
                <p className="lead">{product.description}</p>
                {status(product.status)}
              </div>
            </div>
          </div>
        </section>
        <div className='mb-4'>
          <h1>Comments</h1>
          {comments.length > 0 ? (
            <ul className="list-group">
              {comments.map((comment) => (
                <li key={comment._id} className="list-group-item">
                  <div className='mb-1'>
                    <strong>{comment.email}</strong>
                  </div>
                  <div className='mb-1'>
                    <p>{comment.content}</p>
                    <small className="text-muted">Posted on: {FormatDate(comment.createdAt)}</small>
                  </div>
                  {userId === comment.userId && (
                    <button
                      className="btn btn-danger btn-sm mt-2"
                      onClick={() => handleDelete(comment._id)}
                    >
                      Delete
                    </button>
                  )}
                  {comment.replies.map((reply) => (
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
                    </div>
                  ))}
                  <form onSubmit={(e) => handleReply(e, comment._id)}>
                    <div className="mt-3 mb-3">
                      <textarea
                        className="form-control"
                        id="commentContent"
                        rows="3"
                        value={replyInputs[comment._id]}
                        onChange={(e) => handleReplyChange(comment._id, e)}
                      ></textarea>
                      <button type="submit" className="btn btn-primary btn-sm mt-3">Reply</button>
                    </div>
                  </form>
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-secondary mt-3" role="alert">
              Chưa có bình luận nào được đăng tải.
            </div>
          )}
        </div>
        <div>
          <h2>Leave a comment</h2>
          {userId ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="commentContent" className="form-label">Comment:</label>
                <textarea
                  className="form-control"
                  id="commentContent"
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Add</button>
            </form>
          ) : (
            <div className='border rounded p-3'>
              <p>Vui lòng đăng nhập để sử dụng chức năng</p>
              <Link className="btn btn-outline-dark" to={`/login`}>Login</Link>
            </div>
          )}
        </div>
      </div >
    </>
  );
};

export default Detail;
