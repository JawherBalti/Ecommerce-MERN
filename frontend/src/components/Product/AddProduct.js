import React from 'react'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { isAuth, logout } from '../../helpers/auth';


export default class AddProduct extends React.Component {
    state = {
        title: "",
        description: "",
        price: 0,
        images: "uploads/articleDefault.jpg",
        category: [],
        cat: ""
    }

    componentDidMount = async () => {
        const { data } = await axios.get("http://localhost:5000/categories")
        this.setState({
            category: data
        })
    }


    onChangeTitle = (e) => {
        this.setState({
            title: e.target.value
        })
    }

    onChangeDescription = (e) => {
        this.setState({
            description: e.target.value
        })
    }

    onChangePrice = (e) => {
        this.setState({
            price: e.target.value
        })
    }

    onChangeCategory = (cat) => {
        this.setState({
            cat: cat
        })
    }

    onSubmit = async (e) => {
        e.preventDefault()

        const product = {
            title: this.state.title,
            description: this.state.description,
            price: this.state.price,
            images: this.state.images,
            category: this.state.cat,
        }
        await axios.post("http://localhost:5000/products/add", product)

        window.location = "/admin"
    }

    onDrop = (files) => {
        let formData = new FormData()
        const config = {
            header: { "content-type": "multipart/form-data" }
        }
        formData.append("file", files[0])
        axios.post("http://localhost:5000/products/uploadImage", formData, config)
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        images: res.data.image
                    })
                } else {
                    alert("failed")
                }
            })
    }
    render() {
        if (!isAuth()) { return (<div>Unauthorized access!</div>) }
        else if (isAuth() && isAuth().role !== 1) { return (<div>Unauthorized access! <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/products`}>Back to website</a></div>) }
        else {
            return (
                <div>
                    <nav className="navbar navbar-expand-sm bg-light navbar-light">
                        <ul className="nav nav-tabs">
                            <li className="nav-item"><Link className="nav-link" to="/admin">Home</Link></li>
                            <li className="nav-item"><Link className="nav-link active" to="/admin/products/add">Add products</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/admin/categories">Categories</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/admin/users">Users</Link></li>
                        </ul>
                        <ul className="nav nav-tabs navbar-nav ml-auto">
                            <li className="nav-item"><a onClick={logout} className="nav-link" href="/"><span className="glyphicon glyphicon-log-in"></span> Log out</a></li>
                        </ul>
                    </nav >
                    <div className="container">
                        <h4 style={{textAlign:"center"}}>Upload Product</h4>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Dropzone onDrop={this.onDrop}>
                                {({ getRootProps, getInputProps }) => (
                                    <div style={{ marginTop: "5px", width: "300px", height: "230px", border: "1px solid lightgray", display: "flex", alignItems: "center", justifyContent: "center" }} {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p style={{ marginBottom: "190px" }}>Select product image</p>
                                        <PlusOutlined style={{ fontSize: "3rem", marginRight: "120px" }} />
                                    </div>
                                )}
                            </Dropzone>
                            <div style={{ marginTop: "5px", display: "flex", width: "350px", height: "240px" }}>
                                <div >
                                    <img style={{ width: "333px", height: "223px" }} src={this.state.images ? `http://localhost:5000/${this.state.images}` : ""} alt=""/>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Title:</label>
                                <input className="form-control" type="text" value={this.state.title} onChange={this.onChangeTitle} />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <input className="form-control" type="text" value={this.state.description} onChange={this.onChangeDescription} />
                            </div>
                            <div className="form-group">
                                <label>Price:</label>
                                <input className="form-control" type="text" value={this.state.price} onChange={this.onChangePrice} />
                            </div>
                            <div className="form-group">
                                <select className="form-control" onChange={(e) => this.onChangeCategory(e.target.value)}>
                                    <option>Select a category</option>
                                    {this.state.category.map((cat, i) => <option key={i} value={cat.name}>{cat.name}</option>)}
                                </select>
                            </div>
                            <input className="btn btn-primary" type="submit" value="Add product" />
                        </form>
                    </div>
                </div>
            )
        }
    }
}
