import React from 'react'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { isAuth, logout } from '../../helpers/auth';

export default class AddProducts extends React.Component {
    state = {
        title: "",
        description: "",
        price: 0,
        images: "",
        category: "",
    }

    componentDidMount = async () => {
        const { data } = await axios.get(`http://localhost:5000/products/${this.props.match.params.id}`)
        this.setState({
            title: data.title,
            description: data.description,
            price: data.price,
            images: data.images,
            category: data.category,
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

    onChangeCategory = (e) => {
        this.setState({
            category: e.target.value
        })
    }

    onSubmit = async (id, e) => {
        e.preventDefault()

        const product = {
            title: this.state.title,
            description: this.state.description,
            price: this.state.price,
            images: this.state.images,
            category: this.state.category,
        }
        await axios.post(`http://localhost:5000/products/update/${id}`, product)
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
                    console.log(this.state.images)
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
                            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                            <li className="nav-item"><Link className="nav-link active" to={`/admin/products/edit/${this.props.match.params.id}`}>Edit products</Link></li>
                        </ul>
                        <ul className="nav nav-tabs navbar-nav ml-auto">
                            <li className="nav-item"><a onClick={logout} className="nav-link" href="/"><span className="glyphicon glyphicon-log-in"></span> Log out</a></li>
                        </ul>
                    </nav >
                    <div className="container">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Dropzone onDrop={this.onDrop}>
                                {({ getRootProps, getInputProps }) => (
                                    <div style={{ width: "300px", height: "240px", border: "1px solid lightgray", display: "flex", alignItems: "center", justifyContent: "center" }} {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p style={{ marginBottom: "190px" }}>Select product image</p>
                                        <PlusOutlined style={{ fontSize: "3rem", marginRight: "120px" }} />
                                    </div>
                                )}
                            </Dropzone>
                            <div style={{ display: "flex", width: "350px", height: "240px" }}>
                                <div >
                                    <img style={{ width: "333px", height: "223px" }} src={this.state.images ? `http://localhost:5000/${this.state.images}` : ""} alt=""/>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={(e) => this.onSubmit(this.props.match.params.id, e)}>
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
                                <label>Category:</label>
                                <input className="form-control" type="text" value={this.state.category} onChange={this.onChangeCategory} />
                            </div>
                            <input className="btn btn-primary" type="submit" value="Edit product" />

                        </form>
                    </div>
                </div>
            )
        }
    }
}
