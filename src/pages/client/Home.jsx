import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import axios from "axios";
import NavScroll from "../../components/Navbar";
import { FormatNumber } from '../../Utils';
import Footer from "../../components/Footer";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [searchItem, setSearchItem] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const { data: products } = await axios.get(process.env.REACT_APP_PRODUCT_API + `${searchItem}`);
            setProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleInputChange = (e) => {
        setSearchItem(e.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data: products } = await axios.get(process.env.REACT_APP_PRODUCT_API)
            setProducts(products)
        }
        fetchData()
    }, [])

    return (
        <>
            <NavScroll />
            <div className="home m-3">
                <div className="py-5 text-center mb-3 poster-img">
                    <div class="row py-lg-5 text-white">
                        <div class="col-lg-6 col-md-8 mx-auto ">
                            <h1 class="fw-light">IPHONE 15</h1>
                            <p class="lead text-white"> <b>A16 Bionic</b> tăng cường sức mạnh cho các tính năng tiên tiến. <b>Cùng thiết kế mới đầy sáng tạo</b> sử dụng mặt lưng kính được pha màu xuyên suốt toàn bộ chất liệu.</p>
                            <p>
                                <Link class="btn btn-secondary my-2" to='/detail/664414152fa611fcdab42ab0'>Mua ngay</Link>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="search-bar mt-5">
                    <form className="form-inline my-2 my-lg-0" onSubmit={handleSearch}>
                        <div className="d-flex">
                            <input className="form-control mr-sm-2" type="search" placeholder="Nhập tên sản phẩm" aria-label="Search" value={searchItem} onChange={handleInputChange} />
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit"><i class="bi bi-search"></i></button>
                        </div>
                    </form>
                </div>
                <ul className="product-list mt-5">
                    {products.map((product) => (
                        <li key={product._id} className="product-item">
                            <Card className="mb-3">
                                <Card.Img className="d-flex justify-content-center" variant="top" src={product.imageUrl} />
                                <Card.Body className="d-flex flex-column">
                                    <div className="p-2">
                                        <Card.Title>{product.name}</Card.Title>
                                        <Card.Text style={{ height: '5rem' }}>{product.description}</Card.Text>
                                    </div>
                                    <div className="p-2">
                                        <form className="btn-form d-flex justify-content-between">
                                            <Link className="btn btn-outline-dark" to={`/detail/${product._id}`}>Chi tiết</Link>
                                            {product.status === "0" || product.quantity === 0 ? (
                                                <div>
                                                    <Button variant="outline-dark" disabled>Hết hàng</Button>
                                                </div>
                                            ) : (
                                                <div className="fw-bolder">
                                                    <Button variant="dark">{FormatNumber(product.price)} đ</Button>
                                                </div>
                                            )}
                                        </form>
                                    </div>
                                </Card.Body>
                            </Card>
                        </li>
                    ))}
                </ul>
            </div>
            <Footer />
        </>
    )
}

export default Home