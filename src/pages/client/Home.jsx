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
    const [products, setProducts] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(process.env.REACT_APP_PRODUCT_API)
            setProducts(response.data)
        }
        fetchData()
    }, [])
    return (
        <>
            <NavScroll />
            <div className="home">
                <section class="py-5 text-center container">
                    <div class="row py-lg-5 bg-light">
                        <div class="col-lg-6 col-md-8 mx-auto">
                            <h1 class="fw-light">IPHONE 15</h1>
                            <p class="lead text-body-secondary"> <b>A16 Bionic</b> tăng cường sức mạnh cho các tính năng tiên tiến. <b>Cùng thiết kế mới đầy sáng tạo</b> sử dụng mặt lưng kính được pha màu xuyên suốt toàn bộ chất liệu.</p>
                            <p>
                                <Link class="btn btn-secondary my-2" to='/'>COMING SOON</Link>
                            </p>
                        </div>
                    </div>
                </section>
                <div className="product-list row">
                    {products.map((product) => (
                        <div key={product._id} className="col-md-3">
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
                                            {product.status === "0" ? (
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
                        </div>
                    ))}
                </div>

            </div>
            <Footer />
        </>
    )
}

export default Home