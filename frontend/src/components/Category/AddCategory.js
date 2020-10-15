import React from 'react'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { isAuth, logout } from '../../helpers/auth';

export default class AddCategory extends React.Component {
    state = {
        name: "",
        images: "uploads/articleDefault.jpg"
    }

    onChangeName = (e) => {
        this.setState({
            name: e.target.value,
        })
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
                    console.log(this.state.images)
                } else {
                    alert("failed")
                }
            })
    }

    onSubmit = async (e) => {
        e.preventDefault()
        const Category = {
            name: this.state.name,
            images: this.state.images
        }
        await axios.post("http://localhost:5000/categories/add", Category)
        window.location = "/admin/categories"
    }

    render() {
        if (!isAuth()) { return (<div>Unauthorized access!</div>) }
        else if (isAuth() && isAuth().role !== 1) { return (<div>Unauthorized access! <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/articles`}>Back to website</a></div>) }
        else {
            return (
                <div>
                    <nav className="navbar navbar-expand-sm bg-light navbar-light">
                        <ul className="nav nav-tabs">
                            <li className="nav-item"><Link className="nav-link" to="/admin">Home</Link></li>
                            <li className="nav-item"><Link className="nav-link active" to="/admin/categories/add">Add Categories</Link></li>
                        </ul>
                        <ul className="nav nav-tabs navbar-nav ml-auto">
                            <li className="nav-item"><a onClick={logout} className="nav-link" href="/"><span className="glyphicon glyphicon-log-in"></span> Log out</a></li>
                        </ul>
                    </nav >

                    <div className="container">
                        <h4 style={{ textAlign: "center" }}>Add category</h4>
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
                                    <img style={{ width: "333px", height: "223px" }} src={this.state.images ? `http://localhost:5000/${this.state.images}` : ""} alt="" />
                                </div>
                            </div>
                        </div>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label>Category name:</label>
                                <input className="form-control" type="text" value={this.state.name} onChange={this.onChangeName} placeholder="Enter a category name" />
                            </div>
                            <input className="btn btn-primary" type="submit" value="Add category" />
                        </form>
                    </div>
                </div>
            )
        }
    }
}
