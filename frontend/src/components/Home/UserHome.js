import React, { Component } from 'react'
import Axios from 'axios'
import logo from '../../../src/logo.jpg'
import gaming from '../../../src/CarouselGaming.jpg'
import phones from '../../../src/CarouselPhones.jpg'
import { Carousel, Pagination } from 'antd';
import { Menu, Dropdown, Badge } from 'antd';
import { SettingOutlined, UserOutlined, LogoutOutlined, ShoppingCartOutlined } from '@ant-design/icons'

import { isAuth, logout } from '../../helpers/auth';

export default class Home extends Component {
    state = {
        products: [],
        categories: [],
        minValue: "0",
        maxValue: "2",
        avatar: "uploads/userdefault.jpg",
        userCart: [],
        cartQuantity: ""
    }
    componentDidMount = async () => {
        const cartItems = await Axios.get(`http://localhost:5000/users/${JSON.parse(localStorage.getItem("user"))._id}`)
        const categories = await Axios.get("http://localhost:5000/categories")
        const products = await Axios.get("http://localhost:5000/products/home")
        this.setState({
            products: products.data,
            categories: categories.data,
            cartQuantity: cartItems.data.cart.length
        })

    }
    handleChange = value => {
        if (value <= 1) {
            this.setState({
                minValue: 0,
                maxValue: 2
            });
        } else {
            this.setState({
                minValue: this.state.maxValue,
                maxValue: value * 2
            });
        }
    }

    render() {
        const currentPosts = this.state.categories.slice(this.state.minValue, this.state.maxValue)
        if (!isAuth()) { return (<div>Unauthorized access!</div>) }
        else if (isAuth() && isAuth().role !== 0) { return (<div>Unauthorized access! <a href="/">Back to website</a></div>) }
        else {
            const menu = (
                <Menu >
                    <Menu.Item key="2" icon={<SettingOutlined />}>
                        <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/edit/${isAuth()._id}`}>Edit profile</a>
                    </Menu.Item>
                    <Menu.Item key="1" icon={<LogoutOutlined />}>
                        <a onClick={logout} href="/"> Log out</a>
                    </Menu.Item>
                </Menu>
            );
            return (
                <div>
                    <nav className="navbar sticky-top navbar-expand-sm bg-light navbar-light">
                        <a className="navbar-brand" href="/">
                            <img style={{ width: "150px", height: "50px" }} src={logo} alt="logo" />
                        </a>
                        <ul className="nav nav-tabs navbar-nav ml-auto"></ul>
                        <img alt="" style={{ height: "50px", width: "50px", borderRadius: "50%", border: "1px solid #000" }} src={`http://localhost:5000/${this.state.avatar}`} />
                        <Badge count={this.state.cartQuantity} overflowCount={10}>
                            <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/cart`}><ShoppingCartOutlined style={{ marginLeft: "30px", fontSize: "30px", color: "#007bff" }} /></a>
                        </Badge>
                        <Dropdown.Button icon={<UserOutlined />} overlay={menu}></Dropdown.Button>
                    </nav >
                    <div style={{ width: "100%", height: "40px", backgroundColor: "#179fc0" }}><h6 style={{ fontFamily: "Futura", paddingTop: "12px", textAlign: "center", fontSize: "15px", color: "#fff" }}>We're open for business. Shipping Mon - Fri</h6></div>
                    <Carousel autoplay effect="fade">
                        <div>
                            <h6 style={{ position: "absolute", left: "42%", top: "65%", fontFamily: "initial", fontSize: "20px", color: "#fff" }}>Available for a limited time</h6>
                            <h6 style={{ position: "absolute", left: "33.5%", top: "35%", fontFamily: "initial", fontSize: "25px", color: "#fff" }}>Purchase one of our gaming products and get</h6>
                            <h6 style={{ position: "absolute", left: "35%", top: "40%", fontFamily: "serif", fontSize: "120px", color: "#fff" }}>10% off</h6>
                            <img style={{ width: "100%", height: "650px" }} alt="" src={gaming} />
                            <a className="btn btn-warning" style={{ position: "absolute", left: "44%", top: "76%" }} href="/categories/Gaming">Start Shopping Now</a>
                        </div>
                        <div>
                            <h6 style={{ position: "absolute", left: "28%", top: "35%", fontFamily: "initial", fontSize: "70px", color: "#fff" }}>Checkout our variety of smartphones and tablets</h6>
                            <img style={{ width: "100%", height: "650px" }} alt="" src={phones} />
                            <a className="btn btn-primary" style={{ position: "absolute", left: "47%", top: "70%" }} href="/categories/Phones">Get yours</a>
                        </div>
                    </Carousel>
                    <div className="container">
                        <h2 style={{ textAlign: "center", marginTop: "10px" }}>Select a category</h2>
                        <Pagination style={{ marginLeft: "470px", color:"#000" }}
                            defaultCurrent={1}
                            defaultPageSize={2}
                            onChange={this.handleChange}
                            total={this.state.categories.length}
                        />
                        <div className="row">
                            {currentPosts.map((category, i) => {
                                return (
                                    <div key={i}>
                                        <div className="col" key={i}>
                                            <div className="card" style={{ border: "2px solid #999", marginTop: "50px", width: "33rem", height: "25rem" }}>
                                                <a href={`/categories/${category.name}`}><img style={{ width: "33rem", height: "40rem", outline: "4px solid white", outlineOffset: "-10px" }} alt="" src={`http://localhost:5000/${category.images}`} /><h6 style={{ position: "absolute", textAlign: "center", marginLeft: "auto", marginRight: "auto", left: "0", right: "0", top: "50%", fontFamily: "initial", fontSize: "60px", color: "#fff" }}>{category.name}</h6></a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <a className="btn btn-info" style={{ marginTop: "300px", marginLeft: "470px", marginBottom: "10px" }} href="/home">View all products</a>
                    </div>
                    <div className="footer-copyright text-center py-2">© 2020 Copyright:
                            <a className="text-danger" href="/"> MyWebSite.com</a>
                    </div>
                </div >
            )
        }
    }
}
