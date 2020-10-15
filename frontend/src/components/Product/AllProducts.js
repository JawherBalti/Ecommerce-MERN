import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import { CollapsibleComponent, CollapsibleHead, CollapsibleContent } from "react-collapsible-component";
import logo from '../../../src/logo.jpg'
import { isAuth } from '../../helpers/auth';

export default class AllProducts extends Component {
    state = {
        products: [],
        sortProductByCategory: [],
        categories: [],
        price: "",
        menu: false,
        search: ""
    }

    componentDidMount = async () => {
        const { data } = await axios.get("http://localhost:5000/products/home")
        const categories = await axios.get("http://localhost:5000/categories")
        this.setState({
            products: data,
            sortProductByCategory: data,
            categories: categories.data
        })
    }

    deleteProduct = async (id) => {
        await axios.delete(`http://localhost:5000/products/delete/${id}`)
        this.setState({
            products: this.state.products.filter(product => {
                return (
                    product._id !== id
                )
            })
        })
        await axios.delete("http://localhost:5000/products/deleteImage")
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
        console.log(this.state.price)
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
        if (isAuth() && isAuth().role === 0) return (<Redirect to={`/users/${JSON.parse(localStorage.getItem("user")).name}/products`} />)
        else if (isAuth() && isAuth().role === 1) return (<Redirect to='/admin' />)

        if (this.state.price === "")
            return (
                <div>
                    <nav className="navbar sticky-top navbar-expand-sm bg-light navbar-light">
                        <a className="navbar-brand" href="/">
                            <img style={{ width: "150px", height: "50px" }} src={logo} alt="logo" />
                        </a>
                        <div className="col">
                            <input className="form-control" onChange={this.onChangeSearch} placeholder="Search for a product" />
                        </div>
                        <ul className="nav nav-tabs navbar-nav ml-auto">
                            <li className="nav-item"><Link className="nav-link" to="/signUp"><span className="glyphicon glyphicon-user"></span> Sign Up</Link></li>
                            <li className="nav-item"><a className="nav-link" href="/login"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
                        </ul>
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
                                            <a href="/login"><img alt="" className="card-img-top" style={{ border: "1px solid #000", display: "block", width: "98%", height: "20rem", margin: "auto" }} src={`http://localhost:5000/${product.images}`} /></a>
                                            <div className="card-body">
                                                <h6 className="card-subtitle mb-2 text-muted" style={{ textAlign: "center" }}>Price: ${product.price.toFixed(2)}</h6>
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
                        <a className="navbar-brand" href="/">
                            <img style={{ width: "150px", height: "50px" }} src={logo} alt="logo" />
                        </a>
                        <div className="col">
                            <input className="form-control" onChange={this.onChangeSearch} placeholder="Search for a product" />
                        </div>
                        <ul className="nav nav-tabs navbar-nav ml-auto">
                            <li className="nav-item"><a className="nav-link" href="/signUp"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
                            <li className="nav-item"><a className="nav-link" href="/login"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
                        </ul>
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
                                            <a href={`/users/products/${product._id}`}><img alt="" className="card-img-top" style={{ border: "1px solid #000", display: "block", width: "98%", height: "20rem", margin: "auto" }} src={`http://localhost:5000/${product.images}`} /></a>
                                            <div className="card-body">
                                                <h6 className="card-subtitle mb-2 text-muted" style={{ textAlign: "center" }}>Price: ${product.price.toFixed(2)}</h6>
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
                        <a className="navbar-brand" href="/">
                            <img style={{ width: "150px", height: "50px" }} src={logo} alt="logo" />
                        </a>
                        <div className="col">
                            <input className="form-control" onChange={this.onChangeSearch} placeholder="Search for a product" />
                        </div>
                        <ul className="nav nav-tabs navbar-nav ml-auto">
                            <li className="nav-item"><a className="nav-link" href="/signUp"><span className="glyphicon glyphicon-user"></span> Sign Up</a></li>
                            <li className="nav-item"><a className="nav-link" href="/login"><span className="glyphicon glyphicon-log-in"></span> Login</a></li>
                        </ul>
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
                                            <h5 className="card-title" style={{ textAlign: "center", fontSize: "15px", fontSize: "15px" }}>
                                                {product.title.length < 35 ? `${product.title.charAt(0).toUpperCase() + product.title.slice(1)}` : `${product.title.charAt(0).toUpperCase() + product.title.slice(1).toLowerCase().substring(0, 25)}}...`}

                                            </h5>
                                            <a href={`/users/products/${product._id}`}><img alt="" className="card-img-top" style={{ border: "1px solid #000", display: "block", width: "98%", height: "20rem", margin: "auto" }} src={`http://localhost:5000/${product.images}`} /></a>
                                            <div className="card-body">
                                                <h6 className="card-subtitle mb-2 text-muted" style={{ textAlign: "center" }}>Price: ${product.price.toFixed(2)}</h6>
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
