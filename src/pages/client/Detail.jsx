import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/reducers/cart-reducer';
import axios from 'axios';
import NavScroll from '../../components/Navbar';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormatNumber } from '../../Utils';

const Detail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const id = location.pathname.split('/')[2];
  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);

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

  useEffect(() => {
    const fetchData = async () => {
      const { data : product } = await axios.get(process.env.REACT_APP_PRODUCT_API + `detail/${id}`)
      console.log(product)
      setProduct(product)
    }
    fetchData()
  }, [id])

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
      </div>
    </>
  );
};

export default Detail;
