import React, { Component } from 'react'
import axios from 'axios'
import { Menu, Dropdown, Badge } from 'antd';
import { SettingOutlined, UserOutlined, LogoutOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { isAuth, logout } from '../../helpers/auth';
import logo from '../../../src/logo.jpg'

export default class Cart extends Component {
    state = {
        avatar: "uploads/userdefault.jpg",
        cartProducts: [],
        userCart: [],
        cartProductsWithQauntities: [],
        total: 0,
        cartQuantity: ""
    }
    componentDidMount = async () => {
        let cartItems = []
        const user = await axios.get(`http://localhost:5000/users/${JSON.parse(localStorage.getItem("user"))._id}`)
        user.data.cart.forEach(item => {
            cartItems.push(item.id)
        });
        this.setState({
            userCart: user.data.cart,
            avatar: user.data.avatar,
        })
        const { data } = await axios.get(`http://localhost:5000/products/cartProducts?id=${cartItems}`)
        this.setState({
            cartProducts: data
        })
        this.state.userCart.forEach(cart => {
            this.state.cartProducts.forEach((article, i) => {
                if (cart.id === article._id) {
                    this.state.cartProducts[i].quantity = cart.quantity
                }
            })
        })
        this.setState({
            cartProductsWithQauntities: this.state.cartProducts,
            cartQuantity: this.state.userCart.length,
        })
        this.calculateTotal()
    }

    calculateTotal = () => {
        let total = 0
        this.state.cartProductsWithQauntities.forEach(item => {
            total += item.price * item.quantity
        })
        this.setState({
            total: total
        })
    }

    removeFromCart = async (id) => {
        await axios.get(`http://localhost:5000/products/removeFromCart?id=${id}`, {
            headers: {
                'w_auth': JSON.parse(localStorage.getItem('w_auth_token')),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        this.setState({
            cartProductsWithQauntities: this.state.cartProductsWithQauntities.filter(item => item._id !== id),
            cartQuantity: this.state.cartQuantity - 1
        })
        this.calculateTotal()
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
        return (

            <div>
                <div>
                    <nav className="navbar navbar-expand-sm bg-light navbar-light">
                        <a className="navbar-brand" href={`/${JSON.parse(localStorage.getItem("user")).name}/Home`}>
                            <img style={{ width: "150px", height: "50px" }} src={logo} alt="logo" />
                        </a>
                        <img alt="" style={{ marginLeft: "980px", height: "50px", width: "50px", borderRadius: "50%", border: "1px solid #000" }} src={`http://localhost:5000/${this.state.avatar}`} />
                        <Badge count={this.state.cartQuantity} overflowCount={10}>
                            <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/cart`}><ShoppingCartOutlined style={{ marginLeft: "30px", fontSize: "30px", color: "#007bff" }} /></a>
                        </Badge>
                        <Dropdown.Button icon={<UserOutlined />} overlay={this.menu}></Dropdown.Button>
                    </nav >
                    <div className="container">
                        <div style={{ width: "85%", marginTop: "3rem" }}>
                            <h2>My cart</h2>
                        </div>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Remove from cart</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.cartProductsWithQauntities.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <th><img alt="" style={{ height: "30px", width: "70px" }} src={`http://localhost:5000/${item.images}`} /></th>
                                            <th>{item.title}</th>
                                            <th>$ {item.price.toFixed(2)}</th>
                                            <th>{item.quantity} EA</th>
                                            <th><button onClick={() => this.removeFromCart(item._id)} className="btn btn-danger">Remove</button></th>
                                        </tr>
                                    )
                                })
                                }

                            </tbody>
                        </table>
                        <div style={{ marginTop: "3rem" }}>
                            <h2>Total: ${this.state.total.toFixed(2)}</h2>
                        </div>
                        <button className="btn btn-primary">Check out</button>
                        <a className="btn btn-dark" href={`/${JSON.parse(localStorage.getItem("user")).name}/Home`} style={{ float: "right", marginRight: "1rem" }}>Home</a>
                    </div>
                </div>
                <footer style={{ marginTop: "21%" }}>
                    <div className="footer-copyright text-center py-2">© 2020 Copyright:
                            <a className="text-danger" href="/"> MyWebSite.com</a>
                    </div>
                </footer>
            </div>
        )
    }
}
