import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import axios from 'axios';
import { Link } from "react-router-dom"
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FormatNumber } from '../../Utils';

const Mobile = () => {
  const [mobiles, setMobiles] = useState([])
  const [searchItem, setSearchItem] = useState('');

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(process.env.REACT_APP_PRODUCT_API + `delete/${itemId}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      const updatedMobiles = mobiles.filter(item => item._id !== itemId);
      setMobiles(updatedMobiles);
      toast.success('Xóa sản phẩm thành công')
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data: products } = await axios.get(process.env.REACT_APP_PRODUCT_API + `${searchItem}`);
      setMobiles(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    setSearchItem(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(process.env.REACT_APP_PRODUCT_API)
      setMobiles(data)
    }
    fetchData()
  }, [])
  return (
    <div className='container'>
      <h2 className='mt-5 mb-5'>Sản Phẩm</h2>
      <div className="search-bar mb-4">
        <form className="form-inline my-2 my-lg-0" onSubmit={handleSearch}>
          <div className="d-flex">
            <input className="form-control mr-sm-2" type="search" placeholder="Nhập tên sản phẩm" aria-label="Search" value={searchItem} onChange={handleInputChange} />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit"><i class="bi bi-search"></i></button>
          </div>
        </form>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr className='text-center align-middle'>
            <th>IMG</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Trạng thái</th>
            <th className='d-flex justify-content-center'><Link className='btn btn-outline-success' to={`/admin/mobile/add`}>Thêm</Link></th>
          </tr>
        </thead>
        <tbody>
          {mobiles.map((item) => (
            <tr key={item._id} className="align-middle">
              <td><img class="rounded mx-auto d-block" src={item.imageUrl} alt="" style={{ width: '80px', height: '80px' }} /></td>
              <td>{item.name}</td>
              <td className='text-center'>{FormatNumber(item.price)}đ</td>
              <td className='text-center'>{item.quantity}</td>
              <td className='text-center'>{item.status === '0' ? 'Ngưng kinh doanh' : 'Đang mở'}</td>
              <td className='text-center'>
                <Link className='btn btn-primary' style={{ marginRight: '5px' }} to={`/admin/mobile/update/${item._id}`}>Chỉnh sửa</Link>
                <Button variant="danger" onClick={() => handleDelete(item._id)}>Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Mobile;