import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { isAuth, logout } from '../../helpers/auth';
import { CollapsibleComponent, CollapsibleHead, CollapsibleContent } from "react-collapsible-component";

export default class DisplayProducts extends Component {
    state = {
        products: [],
        sortProductByCategory: [],
        categories: [],
        price: "",
        menu: false,
        search: ""
    }

    componentDidMount = async () => {
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
            categories: categories.data
        })
    }

    deleteProduct = async (id) => {
        await axios.delete(`http://localhost:5000/products/deleteImage?id=${id}`)
        await axios.delete(`http://localhost:5000/products/delete/${id}`)
        await axios.get(`http://localhost:5000/products/removeFromAllCarts?id=${id}`)
        this.setState({
            sortProductByCategory: this.state.sortProductByCategory.filter(product => {
                return (
                    product._id !== id
                )
            })
        })
        console.log(this.state.sortProductByCategory)
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
        else if (isAuth() && isAuth().role !== 1) { return (<div>Unauthorized access! <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/products`}>Back to website</a></div>) }
        else {
            if (this.state.price === "")
                return (
                    <div>
                        <nav className="navbar sticky-top navbar-expand-sm bg-light navbar-light">
                            <ul className="nav nav-tabs">
                                <li className="nav-item"><Link className="nav-link active" to="/admin">Home</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/admin/products/add">Add products</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/admin/categories">Categories</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/admin/users">Users</Link></li>
                            </ul>
                            <div className="col">
                                <input className="form-control" onChange={this.onChangeSearch} placeholder="Search for a product" />
                            </div>
                            <ul className="nav nav-tabs navbar-nav ml-auto">
                                <li className="nav-item"><a onClick={logout} className="nav-link" href="/"><span className="glyphicon glyphicon-log-in"></span> Log out</a></li>
                            </ul>
                        </nav >

                        <div className="card bg-light text-dark" style={{ margin: "auto", marginTop: "4px", width: "95%", display: "flex", justifyContent: "center" }}>
                            <CollapsibleComponent>
                                <CollapsibleHead className="bg-secondary">
                                    <h6>Sort products</h6>
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
                                            <div className="card" style={{ border: "2px solid #999", marginTop: "5px", width: "17rem", height: "32rem" }}>
                                                <h5 className="card-title" style={{ textAlign: "center", fontSize: "15px" }}>
                                                    {product.title.length < 35 ? `${product.title.charAt(0).toUpperCase() + product.title.slice(1)}` : `${product.title.charAt(0).toUpperCase() + product.title.slice(1).toLowerCase().substring(0, 25)}}...`}
                                                </h5>
                                                <img alt="" className="card-img-top" style={{ border: "1px solid #000", display: "block", width: "98%", height: "20rem", margin: "auto" }} src={`http://localhost:5000/${product.images}`} />
                                                <div className="card-body">
                                                    <h6 className="card-subtitle mb-2 text-muted">Price: ${product.price.toFixed(2)}</h6>
                                                    <p className="card-text">{product.description.length < 35 ? `${product.description.charAt(0).toUpperCase() + product.description.slice(1)}` : `${product.description.charAt(0).toUpperCase() + product.description.slice(1).toLowerCase().substring(0, 25)}}...`}</p>
                                                    <a className="btn btn-primary" style={{ margin: "auto" }} href={`/admin/products/edit/${product._id}`}>Edit</a> <button className="btn btn-danger" style={{ margin: "auto" }} onClick={() => this.deleteProduct(product._id)}>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            else if (this.state.price === "1")
                return (
                    <div>
                        <nav className="navbar sticky-top navbar-expand-sm bg-light navbar-light">
                            <ul className="nav nav-tabs">
                                <li className="nav-item"><Link className="nav-link active" to="/admin">Home</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/admin/product/add">Add products</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/admin/categories">Categories</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/admin/users">Users</Link></li>
                            </ul>
                            <div className="col">
                                <input className="form-control" onChange={this.onChangeSearch} placeholder="Search for a product" />
                            </div>
                            <ul className="nav nav-tabs navbar-nav ml-auto">
                                <li className="nav-item"><a onClick={logout} className="nav-link" href="/"><span className="glyphicon glyphicon-log-in"></span> Log out</a></li>
                            </ul>
                        </nav >
                        <div className="card bg-light text-dark" style={{ margin: "auto", marginTop: "4px", width: "95%", display: "flex", justifyContent: "center" }}>
                            <CollapsibleComponent>
                                <CollapsibleHead className="bg-secondary">
                                    <h6>Sort products</h6>
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
                                            <div className="card" style={{ border: "2px solid #999", marginTop: "5px", width: "17rem", height: "32rem" }}>
                                                <h5 className="card-title" style={{ textAlign: "center", fontSize: "15px" }}>
                                                    {product.title.length < 35 ? `${product.title.charAt(0).toUpperCase() + product.title.slice(1)}` : `${product.title.charAt(0).toUpperCase() + product.title.slice(1).toLowerCase().substring(0, 25)}}...`}
                                                </h5>
                                                <img alt="" className="card-img-top" style={{ border: "1px solid #000", display: "block", width: "98%", height: "20rem", margin: "auto" }} src={`http://localhost:5000/${product.images}`} />
                                                <div className="card-body">
                                                    <h6 className="card-subtitle mb-2 text-muted">Price: ${product.price.toFixed(2)}</h6>
                                                    <p className="card-text">{product.description.length < 35 ? `${product.description.charAt(0).toUpperCase() + product.description.slice(1)}` : `${product.description.charAt(0).toUpperCase() + product.description.slice(1).toLowerCase().substring(0, 25)}}...`}</p>
                                                    <a className="btn btn-primary" style={{ margin: "auto" }} href={`/admin/products/edit/${product._id}`}>Edit</a> <button className="btn btn-danger" style={{ margin: "auto" }} onClick={() => this.deleteProduct(product._id)}>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            else if (this.state.price === "2")
                return (
                    <div>
                        <nav className="navbar sticky-top navbar-expand-sm bg-light navbar-light">
                            <ul className="nav nav-tabs">
                                <li className="nav-item"><Link className="nav-link active" to="/admin">Home</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/admin/products/add">Add products</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/admin/categories">Categories</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/admin/users">Users</Link></li>
                            </ul>
                            <div className="col">
                                <input className="form-control" onChange={this.onChangeSearch} placeholder="Search for a product" />
                            </div>
                            <ul className="nav nav-tabs navbar-nav ml-auto">
                                <li className="nav-item"><a onClick={logout} className="nav-link" href="/"><span className="glyphicon glyphicon-log-in"></span> Log out</a></li>
                            </ul>
                        </nav >
                        <div className="card bg-light text-dark" style={{ margin: "auto", marginTop: "4px", width: "95%", display: "flex", justifyContent: "center" }}>
                            <CollapsibleComponent>
                                <CollapsibleHead className="bg-secondary ">
                                    <h6>Sort products</h6>
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
                                            <div className="card" style={{ border: "2px solid #999", marginTop: "5px", width: "17rem", height: "32rem" }}>
                                                <h5 className="card-title" style={{ textAlign: "center", fontSize: "15px" }}>
                                                    {product.title.length < 35 ? `${product.title.charAt(0).toUpperCase() + product.title.slice(1)}` : `${product.title.charAt(0).toUpperCase() + product.title.slice(1).toLowerCase().substring(0, 25)}}...`}
                                                </h5>
                                                <img alt="" className="card-img-top" style={{ border: "1px solid #000", display: "block", width: "98%", height: "20rem", margin: "auto" }} src={`http://localhost:5000/${product.images}`} />
                                                <div className="card-body">
                                                    <h6 className="card-subtitle mb-2 text-muted">Price: ${product.price.toFixed(2)}</h6>
                                                    <p className="card-text">{product.description.length < 35 ? `${product.description.charAt(0).toUpperCase() + product.description.slice(1)}` : `${product.description.charAt(0).toUpperCase() + product.description.slice(1).toLowerCase().substring(0, 25)}}...`}</p>
                                                    <a className="btn btn-primary" style={{ margin: "auto" }} href={`/admin/products/edit/${product._id}`}>Edit</a> <button className="btn btn-danger" style={{ margin: "auto" }} onClick={() => this.deleteProduct(product._id)}>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
        }
    }
}
