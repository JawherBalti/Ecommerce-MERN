import React from 'react'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import { PlusOutlined, SettingOutlined, UserOutlined, LogoutOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { isAuth, logout } from '../../helpers/auth';
import { Menu, Dropdown, Badge } from 'antd';
import logo from '../../../src/logo.jpg'


export default class UserEditUser extends React.Component {
    state = {
        name: "",
        email: "",
        avatar: "",
        role: 0,
        cartQuantity: ""
    }

    componentDidMount = async () => {
        const cartItems = await axios.get(`http://localhost:5000/users/${JSON.parse(localStorage.getItem("user"))._id}`)
        const { data } = await axios.get(`http://localhost:5000/users/${this.props.match.params.id}`)
        this.setState({
            name: data.name,
            email: data.email,
            avatar: data.avatar,
            role: data.role,
            cartQuantity: cartItems.data.cart.length
        })
    }

    onChangeUserName = (e) => {
        this.setState({
            name: e.target.value
        })
    }

    onChangeEmail = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    onChangeRole = (role) => {
        this.setState({
            role: role
        })
    }

    onSubmit = async (id, e) => {
        e.preventDefault()

        const User = {
            name: this.state.name,
            email: this.state.email,
            avatar: this.state.avatar,
            role: this.state.role
        }
        await axios.post(`http://localhost:5000/users/update/${id}`, User)
        const storage = JSON.parse(localStorage.getItem("user"))
        const localStorageData = {
            _id: storage._id,
            name: this.state.name,
            email: storage.email,
            role: storage.role
        }
        localStorage.setItem("user", JSON.stringify(localStorageData))
        window.location = `/${JSON.parse(localStorage.getItem("user")).name}/Home`
    }

    onDrop = (files) => {
        let formData = new FormData()
        const config = {
            header: { "content-type": "multipart/form-data" }
        }
        formData.append("file", files[0])
        axios.post("http://localhost:5000/users/uploadImage", formData, config)
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        avatar: res.data.image
                    })
                } else {
                    alert("failed")
                }
            })
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
        if (!isAuth()) { return (<div>Unauthorized access!</div>) }
        else if (isAuth() && isAuth().role !== 0) { return (<div>Unauthorized access! <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/products`}>Back to website</a></div>) }
        else {
            return (
                <div>
                    <nav className="navbar navbar-expand-sm bg-light navbar-light">
                        <a className="navbar-brand" href={`/${JSON.parse(localStorage.getItem("user")).name}/Home`}>
                            <img style={{ width: "150px", height: "50px" }} src={logo} alt="logo" />
                        </a>
                        <img style={{ marginLeft: "980px", height: "50px", width: "50px", borderRadius: "50%", border: "1px solid #000" }} src={`http://localhost:5000/${this.state.avatar}`} alt="" />
                        <Badge count={this.state.cartQuantity} overflowCount={10}>
                            <a href={`/users/${JSON.parse(localStorage.getItem("user")).name}/cart`}><ShoppingCartOutlined style={{ marginLeft: "30px", fontSize: "30px", color: "#007bff" }} /></a>
                        </Badge>
                        <Dropdown.Button icon={<UserOutlined />} overlay={this.menu}></Dropdown.Button>
                    </nav >
                    <div className="container">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Dropzone onDrop={this.onDrop}>
                                {({ getRootProps, getInputProps }) => (
                                    <div style={{ width: "300px", height: "240px", border: "1px solid lightgray", display: "flex", alignItems: "center", justifyContent: "center" }} {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p style={{ marginBottom: "190px" }}>Select user avatar</p>
                                        <PlusOutlined style={{ fontSize: "3rem", marginRight: "120px" }} />
                                    </div>
                                )}
                            </Dropzone>
                            <div style={{ display: "flex", width: "350px", height: "240px" }}>
                                <div >
                                    <img style={{ width: "333px", height: "223px" }} alt="Avatar" src={this.state.avatar ? `http://localhost:5000/${this.state.avatar}` : ""} />
                                </div>
                            </div>
                        </div>
                        <form onSubmit={(e) => this.onSubmit(this.props.match.params.id, e)}>
                            <div className="form-group">
                                <label>Username:</label>
                                <input className="form-control" type="text" value={this.state.name} onChange={this.onChangeUserName} />
                            </div>
                            <input className="btn btn-primary" type="submit" value="Edit user" />
                            <Link className="btn btn-dark" to={`/${JSON.parse(localStorage.getItem("user")).name}/Home`} style={{ float: "right" }}>Home</Link>
                        </form>
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
