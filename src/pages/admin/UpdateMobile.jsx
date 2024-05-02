import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const UpdateMobile = () => {
  const { id } = useParams();
  const [mobile, setMobile] = useState({
    name: '',
    price: '',
    imageUrl: '',
    description: '',
    status: '',
  });

  const [demoImage, setDemoImage] = useState(null)

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMobile = async () => {
      try {
        const { data: prod } = await axios.get(process.env.REACT_APP_PRODUCT_API + `detail/${id}`)
        setMobile(prod);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMobile();
  }, [id]);

  useEffect(() => {
    setDemoImage(mobile.imageUrl);
  }, [mobile.imageUrl]);

  const handleUpdateMobile = async (e) => {
    e.preventDefault();
    try {
      await axios.post(process.env.REACT_APP_PRODUCT_API + `update`, {
        id: id,
        name: mobile.name,
        price: mobile.price,
        imageUrl: mobile.imageUrl,
        description: mobile.description,
        status: mobile.status,
      }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
      toast.success('Chỉnh sửa thành công');
      navigate('/admin/mobile');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className='container'>
      <div class="header-laptop mt-5 d-flex justify-content-between">
        <h3>Cập Nhật Sản Phẩm</h3>
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

      <Form onSubmit={handleUpdateMobile}>
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={mobile.name}
            onChange={(e) => setMobile({ ...mobile, name: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter price"
            value={mobile.price}
            onChange={(e) => setMobile({ ...mobile, price: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="formImageURL">
          <Form.Label>Image URL</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter image URL"
            value={mobile.imageUrl}
            onChange={(e) => setMobile({ ...mobile, imageUrl: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            value={mobile.description}
            onChange={(e) => setMobile({ ...mobile, description: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="formStatus">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            value={mobile.status}
            onChange={(e) => setMobile({ ...mobile, status: parseInt(e.target.value, 10) })}
          >
            <option value={1}>Còn hàng</option>
            <option value={0}>Hết hàng</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" className='mt-3'>
          Cập nhật
        </Button>
      </Form>
    </div>
  )
}

export default UpdateMobile