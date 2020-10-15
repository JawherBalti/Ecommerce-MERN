import React, { Component } from 'react'
import axios from 'axios'
import logo from '../../../src/logo.jpg'
import { isAuth, logout } from '../../helpers/auth'
import { Link } from 'react-router-dom'
import { Menu, Dropdown, Badge } from 'antd'
import { SettingOutlined, UserOutlined, LogoutOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { ToastContainer, toast } from 'react-toastify'

export default class DetailProduct extends Component {
    state = {
        title: "",
        description: "",
        price: 0,
        images: "",
        category: "",
        avatar: "uploads/userdefault.jpg",
        cartQuantity: ""
    }
    componentDidMount = async () => {
        const cartItems = await axios.get(`http://localhost:5000/users/${JSON.parse(localStorage.getItem("user"))._id}`)
        const { data } = await axios.get(`http://localhost:5000/products/${this.props.match.params.id}`)
        this.setState({
            title: data.title,
            description: data.description,
            price: data.price,
            images: data.images,
            category: data.category,
            cartQuantity: cartItems.data.cart.length
        })
    }

    addToCart = async (_id) => {
        await axios.get(`http://localhost:5000/products/addToCart/${_id}`, {
            headers: {
                'w_auth': JSON.parse(localStorage.getItem('w_auth_token')),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        const cartItems = await axios.get(`http://localhost:5000/users/${JSON.parse(localStorage.getItem("user"))._id}`)
        this.setState({
            cartQuantity: cartItems.data.cart.length
        })
        toast.success("Item added to cart successfully!")
    }

    menu = (
        <Menu >
            <Menu.Item key="2" icon={<SettingOutlined />}>
                <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/edit/${isAuth()._id}`}>Edit profile</a>
            </Menu.Item>
            <Menu.Item key="1" icon={<LogoutOutlined />}>
                <a onClick={logout} href="/"> Log out</a>
            </Menu.Item>
        </Menu>
    );

    render() {
        if (!isAuth()) return (<div>unauthorized access!<a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/products`}>Back to website</a></div>)
        else if (isAuth() && isAuth().role !== 0) return (<div>unauthorized access!<a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/products`}>Back to website</a></div>)
        else if (isAuth() && isAuth().role === 0 && this.state.title === "") {
            return (<div>Product not found <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/products`}>Back to website</a></div>)
        }
        else {
            return (
                <div>
                    <nav className="navbar navbar-expand-sm bg-light navbar-light">
                        <a className="navbar-brand" href={`/${JSON.parse(localStorage.getItem("user")).name}/Home`}>
                            <img style={{ width: "150px", height: "50px" }} src={logo} alt="logo" />
                        </a>
                        <ToastContainer style={{ marginTop: "2rem" }} />
                        <img alt="" style={{ marginLeft: "980px", height: "50px", width: "50px", borderRadius: "50%", border: "1px solid #000" }} src={`http://localhost:5000/${this.state.avatar}`} />
                        <Badge count={this.state.cartQuantity} overflowCount={10}>
                            <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/cart`}><ShoppingCartOutlined style={{ marginLeft: "30px", fontSize: "30px", color: "#007bff" }} /></a>
                        </Badge>
                        <Dropdown.Button icon={<UserOutlined />} overlay={this.menu}></Dropdown.Button>
                    </nav >
                    <div className="container">
                        <div style={{ paddingBottom: "1rem", paddingTop: "1rem", margin: "20px 20px 20px 20px", border: "3px solid #333", overflow: "auto" }}>
                            <div style={{ float: "left" }}>
                                <img alt="" style={{ border: "1px solid #555", margin: "0px 10px 0px 10px", width: "15rem", height: "19rem", display: "block" }} src={`http://localhost:5000/${this.state.images}`} />
                            </div>
                            <div style={{ marginLeft: "210px" }}>
                                <h5 style={{ fontWeight: "bold", fontSize: "200%" }}>Title: {this.state.title}</h5>
                                <h5>Description:<p style={{ fontSize: "14px", color: "rgb(129, 128, 128)" }}> {this.state.description}</p></h5>
                                <h5>Price: ${this.state.price.toFixed(2)}</h5>
                            </div>
                            <Link className="btn btn-dark" to={`/${JSON.parse(localStorage.getItem("user")).name}/Home`} style={{ float: "right", marginTop: "8rem", marginRight: "1rem" }}>Home</Link>
                            <button onClick={() => this.addToCart(this.props.match.params.id)} className="btn btn-primary" style={{ float: "right", marginTop: "8rem", marginRight: "1rem" }}>Add to cart</button>
                        </div>
                    </div>
                    <footer style={{marginTop:"15%"}}>
                        <div className="footer-copyright text-center py-2">© 2020 Copyright:
                            <a className="text-danger" href="/"> MyWebSite.com</a>
                        </div>
                    </footer>
                </div>
            )
        }
    }
}
