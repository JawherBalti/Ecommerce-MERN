import React, { Component } from 'react'
import axios from 'axios'
import { isAuth, logout } from '../../helpers/auth';
import { CollapsibleComponent, CollapsibleHead, CollapsibleContent } from "react-collapsible-component";
import logo from '../../../src/logo.jpg'
import { Menu, Dropdown, Badge } from 'antd';
import { SettingOutlined, UserOutlined, LogoutOutlined, ShoppingCartOutlined } from '@ant-design/icons'

// const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjRhZTI1YjI5ZTYzMzBhYmNiZjRhODQiLCJpYXQiOjE1OTg3NTIzNzUsImV4cCI6MTU5OTM1NzE3NX0.AKFMXlwaWjxOqmRt73KcVFXmUgGvvXys2woSWggmriM"
// const authAxios = axios.create({
//     baseURL: "http://localhost:5000/articles",
//     headers: {
//         token: accessToken
//     }
// })

export default class DisplayProducts extends Component {
    state = {
        products: [],
        sortProductByCategory: [],
        categories: [],
        price: "",
        menu: false,
        search: "",
        avatar: "uploads/userdefault.jpg",
        cartQuantity: ""
    }

    componentDidMount = async () => {
        const cartItems = await axios.get(`http://localhost:5000/users/${JSON.parse(localStorage.getItem("user"))._id}`)
        const { data } = await axios.get(`http://localhost:5000/products`, {
            headers: {
                'w_auth': JSON.parse(localStorage.getItem('w_auth_token')),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }

        })
        const categories = await axios.get("http://localhost:5000/categories")
        this.setState({
            products: data,
            sortProductByCategory: data,
            categories: categories.data,
            cartQuantity: cartItems.data.cart.length
        })
    }

    filterByCategory = (category) => {
        category === "" ? this.setState({
            sortProductByCategory: this.state.products
        }) : this.setState({
            sortProductByCategory: this.state.products.filter(product => {
                return (
                    product.category === category
                )
            })
        })
    }

    onChangeSortByPrice = (price) => {
        this.setState({
            price: price
        })
    }

    onChangeSearch = (e) => {
        this.setState({
            search: e.target.value
        })
    }

    highestToLowestPrice = (data) => {
        const sortedData = [...data]
        sortedData.sort((a, b) => {
            if (a.price > b.price) {
                return -1
            }
            else {
                return 1
            }
        })
        return sortedData
    }

    lowestToHighestPrice = (data) => {
        const sortedData = [...data]
        sortedData.sort((a, b) => {
            if (a.price < b.price) {
                return -1
            }
            else {
                return 1
            }
        })
        return sortedData
    }

    render() {
        const searchedProducts = this.state.sortProductByCategory.filter(product => {
            return product.title.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1
        })
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
            if (this.state.price === "")
                return (
                    <div>
                        <nav className="navbar sticky-top navbar-expand-sm bg-light navbar-light">
                            <a className="navbar-brand" href={`/${JSON.parse(localStorage.getItem("user")).name}/Home`}>
                                <img style={{ width: "150px", height: "50px" }} src={logo} alt="logo" />
                            </a>
                            <div className="col">
                                <input className="form-control" onChange={this.onChangeSearch} placeholder="Search for a product" />
                            </div>
                            <img alt="" style={{ height: "50px", width: "50px", borderRadius: "50%", border: "1px solid #000" }} src={`http://localhost:5000/${this.state.avatar}`} />
                            <Badge count={this.state.cartQuantity} overflowCount={10}>
                                <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/cart`}><ShoppingCartOutlined style={{ marginLeft: "30px", fontSize: "30px", color: "#007bff" }} /></a>
                            </Badge>
                            <Dropdown.Button icon={<UserOutlined />} overlay={menu}></Dropdown.Button>
                        </nav >

                        <div className="card bg-light text-dark" style={{ margin: "auto", marginTop: "4px", width: "95%", display: "flex", justifyContent: "center" }}>
                            <CollapsibleComponent>
                                <CollapsibleHead className="bg-secondary" >
                                    <h6 style={{ color: "#fff" }}>Sort products</h6>
                                </CollapsibleHead>
                                <CollapsibleContent>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <select className="form-control dropdown-toggle" onChange={(e) => this.filterByCategory(e.target.value)}>
                                                    <option value="">All categories</option>
                                                    {this.state.categories.map((category, i) => <option key={i} value={category.name}>{category.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="form-control dropdown-toggle" onChange={(e) => this.onChangeSortByPrice(e.target.value)}>
                                                    <option value="">Sort by price</option>
                                                    <option value="1">Highest to lowest</option>
                                                    <option value="2">Lowest to highest</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </CollapsibleComponent>
                        </div>

                        <div className="container">
                            <div className="row">
                                {searchedProducts.map((product, i) => {
                                    return (
                                        <div className="col-sm-3" key={i}>
                                            <div className="card" style={{ border: "2px solid #999", marginTop: "5px", width: "17rem", height: "25rem" }}>
                                                <h5 className="card-title" style={{ textAlign: "center", fontSize: "15px" }}>
                                                    {product.title.length < 35 ? `${product.title.charAt(0).toUpperCase() + product.title.slice(1)}` : `${product.title.charAt(0).toUpperCase() + product.title.slice(1).toLowerCase().substring(0, 25)}}...`}

                                                </h5>
                                                <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/products/${product._id}`}><img alt="" className="card-img-top" style={{ border: "1px solid #000", display: "block", width: "98%", height: "20rem", margin: "auto" }} src={`http://localhost:5000/${product.images}`} /></a>
                                                <div className="card-body">
                                                    <h6 className="card-subtitle mb-2 text-muted" style={{ textAlign: "center" }}>Price: ${product.price.toFixed(2)}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <footer style={{ marginTop: "15%" }}>
                            <div className="footer-copyright text-center py-2">© 2020 Copyright:
                            <a className="text-danger" href="/"> MyWebSite.com</a>
                            </div>
                        </footer>
                    </div>
                )
            else if (this.state.price === "1")
                return (
                    <div>
                        <nav className="navbar sticky-top navbar-expand-sm bg-light navbar-light">
                            <a className="navbar-brand" href={`/${JSON.parse(localStorage.getItem("user")).name}/Home`}>
                                <img style={{ width: "150px", height: "50px" }} src={logo} alt="logo" />
                            </a>
                            <div className="col">
                                <input className="form-control" onChange={this.onChangeSearch} placeholder="Search for a product" />
                            </div>
                            <img alt="" style={{ height: "50px", width: "50px", borderRadius: "50%", border: "1px solid #000" }} src={`http://localhost:5000/${this.state.avatar}`} />
                            <Badge count={this.state.cartQuantity} overflowCount={10}>
                                <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/cart`}><ShoppingCartOutlined style={{ marginLeft: "30px", fontSize: "30px", color: "#007bff" }} /></a>
                            </Badge>
                            <Dropdown.Button icon={<UserOutlined />} overlay={menu}></Dropdown.Button>
                        </nav >
                        <div className="card bg-light text-dark" style={{ margin: "auto", marginTop: "4px", width: "95%", display: "flex", justifyContent: "center" }}>
                            <CollapsibleComponent>
                                <CollapsibleHead className="bg-secondary">
                                    <h6 style={{ color: "#fff" }}>Sort products</h6>
                                </CollapsibleHead>
                                <CollapsibleContent>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <select className="form-control dropdown-toggle" onChange={(e) => this.filterByCategory(e.target.value)}>
                                                    <option value="">All categories</option>
                                                    {this.state.categories.map((category, i) => <option key={i} value={category.name}>{category.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="form-control dropdown-toggle" onChange={(e) => this.onChangeSortByPrice(e.target.value)}>
                                                    <option value="">Sort by price</option>
                                                    <option value="1">Highest to lowest</option>
                                                    <option value="2">Lowest to highest</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </CollapsibleComponent>
                        </div>
                        <div className="container">
                            <div className="row">
                                {this.highestToLowestPrice(searchedProducts).map((product, i) => {
                                    return (
                                        <div className="col-sm-3" key={i}>
                                            <div className="card" style={{ border: "2px solid #999", marginTop: "5px", width: "17rem", height: "25rem" }}>
                                                <h5 className="card-title" style={{ textAlign: "center", fontSize: "15px" }}>
                                                    {product.title.length < 35 ? `${product.title.charAt(0).toUpperCase() + product.title.slice(1)}` : `${product.title.charAt(0).toUpperCase() + product.title.slice(1).toLowerCase().substring(0, 25)}}...`}
                                                </h5>
                                                <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/products/${product._id}`}><img alt="" className="card-img-top" style={{ border: "1px solid #000", display: "block", width: "98%", height: "20rem", margin: "auto" }} src={`http://localhost:5000/${product.images}`} /></a>
                                                <div className="card-body">
                                                    <h6 className="card-subtitle mb-2 text-muted" style={{ textAlign: "center" }}>Price: ${product.price.toFixed(2)}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <footer style={{ marginTop: "15%" }}>
                            <div className="footer-copyright text-center py-2">© 2020 Copyright:
                            <a className="text-danger" href="/"> MyWebSite.com</a>
                            </div>
                        </footer>
                    </div>
                )
            else if (this.state.price === "2")
                return (
                    <div>
                        <nav className="navbar sticky-top navbar-expand-sm bg-light navbar-light">
                            <a className="navbar-brand" href={`/${JSON.parse(localStorage.getItem("user")).name}/Home`}>
                                <img style={{ width: "150px", height: "50px" }} src={logo} alt="logo" />
                            </a>
                            <div className="col">
                                <input className="form-control" onChange={this.onChangeSearch} placeholder="Search for a product" />
                            </div>
                            <img alt="" style={{ height: "50px", width: "50px", borderRadius: "50%", border: "1px solid #000" }} src={`http://localhost:5000/${this.state.avatar}`} />
                            <Badge count={this.state.cartQuantity} overflowCount={10}>
                                <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/cart`}><ShoppingCartOutlined style={{ marginLeft: "30px", fontSize: "30px", color: "#007bff" }} /></a>
                            </Badge>
                            <Dropdown.Button icon={<UserOutlined />} overlay={menu}></Dropdown.Button>
                        </nav >
                        <div className="card bg-light text-dark" style={{ margin: "auto", marginTop: "4px", width: "95%", display: "flex", justifyContent: "center" }}>
                            <CollapsibleComponent>
                                <CollapsibleHead className="bg-secondary">
                                    <h6 style={{ color: "#fff" }}>Sort products</h6>
                                </CollapsibleHead>
                                <CollapsibleContent>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <select className="form-control dropdown-toggle" onChange={(e) => this.filterByCategory(e.target.value)}>
                                                    <option value="">All categories</option>
                                                    {this.state.categories.map((category, i) => <option key={i} value={category.name}>{category.name}</option>)}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <select className="form-control dropdown-toggle" onChange={(e) => this.onChangeSortByPrice(e.target.value)}>
                                                    <option value="">Sort by price</option>
                                                    <option value="1">Highest to lowest</option>
                                                    <option value="2">Lowest to highest</option>
                                                </select>
                                            </div>

                                        </div>
                                    </div>
                                </CollapsibleContent>
                            </CollapsibleComponent>
                        </div>
                        <div className="container">
                            <div className="row">
                                {this.lowestToHighestPrice(searchedProducts).map((product, i) => {
                                    return (
                                        <div className="col-sm-3" key={i}>
                                            <div className="card" style={{ border: "2px solid #999", marginTop: "5px", width: "17rem", height: "25rem" }}>
                                                <h5 className="card-title" style={{ textAlign: "center", fontSize: "15px" }}>
                                                    {product.title.length < 35 ? `${product.title.charAt(0).toUpperCase() + product.title.slice(1)}` : `${product.title.charAt(0).toUpperCase() + product.title.slice(1).toLowerCase().substring(0, 25)}}...`}
                                                </h5>
                                                <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/products/${product._id}`}><img alt="" className="card-img-top" style={{ border: "1px solid #000", display: "block", width: "98%", height: "20rem", margin: "auto" }} src={`http://localhost:5000/${product.images}`} /></a>
                                                <div className="card-body">
                                                    <h6 className="card-subtitle mb-2 text-muted" style={{ textAlign: "center" }}>Price: ${product.price.toFixed(2)}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <footer style={{ marginTop: "15%" }}>
                            <div className="footer-copyright text-center py-2">© 2020 Copyright:
                            <a className="text-danger" href="/"> MyWebSite.com</a>
                            </div>
                        </footer>
                    </div>
                )
        }
    }
}
