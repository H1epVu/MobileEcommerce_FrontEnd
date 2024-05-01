import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from "react-router-dom"
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Mobile = () => {
  const [mobiles, setMobiles] = useState([])
  const handleDelete = async (itemId) => {
    try {
      await axios.delete(process.env.REACT_APP_PRODUCT_API + `delete/${itemId}`)
      const updatedMobiles = mobiles.filter(item => item._id !== itemId);
      setMobiles(updatedMobiles);
      toast.success('Xóa sản phẩm thành công')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(process.env.REACT_APP_PRODUCT_API)
      setMobiles(res.data)
    }
    fetchData()
  }, [])
  return (
    <div className='container'>
      <h2 className='mt-5 mb-5'>Sản Phẩm</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Status</th>
            <th className='d-flex justify-content-center'><Link className='btn btn-success' to={`/admin/mobile/add`}>Thêm mới</Link></th>
          </tr>
        </thead>
        <tbody>
          {mobiles.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.status === '0' ? 'Hết hàng' : 'Còn hàng'}</td>
              <td style={{ textAlign: 'center' }}>
                <Link className='btn btn-primary' style={{ marginRight: '5px' }} to={`/admin/mobile/update/${item._id}`}>Edit</Link>
                <Button variant="danger" onClick={() => handleDelete(item._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Mobile;