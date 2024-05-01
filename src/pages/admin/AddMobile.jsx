import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css";

const AddMobile = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setimageUrl] = useState('')
  const [description, setDescription] = useState('')
  const [demoImage, setDemoImage] = useState(null)
  const handleAddMobile = async (e) => {
    e.preventDefault();

    try {
      await axios.post(process.env.REACT_APP_PRODUCT_API + `add`, {
        name: name,
        price: price,
        imageUrl: imageUrl,
        description: description,
        status: 'open'
      }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });

      toast.success('Thêm thành công');
      setTimeout(() => {
        navigate('/admin/mobile');
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error('Thêm không thành công');
    }
  };
  useEffect(() => {
    setDemoImage(imageUrl);
  }, [imageUrl]);
  return (
    <div className='container'>
      <div class="header-laptop mt-5 d-flex justify-content-between">
        <h3>Thêm Sản Phẩm</h3>
        <Link class="btn btn-danger" to={'/admin/mobile'}>Quay Lại</Link>
      </div>
      <div className="demo-image-container">
        {demoImage && (
          <img
            src={demoImage}
            alt="Demo"
            style={{ width: '20%', display: 'block', margin: '0 auto' }}
          />
        )}
      </div>
      <form onSubmit={handleAddMobile}>
        <Form.Group className='form-group' controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='form-group' controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='form-group' controlId="formimageUrl">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            value={imageUrl}
            onChange={(e) => setimageUrl(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='form-group' controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Button variant="success" type="submit" className='mt-3'>
          Thêm
        </Button>
      </form>
    </div>
  )
}

export default AddMobile