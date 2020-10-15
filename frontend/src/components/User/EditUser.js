import React from 'react'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { isAuth, logout } from '../../helpers/auth';

export default class AddUser extends React.Component {
    state = {
        name: "",
        email: "",
        avatar: "",
        role: 0,
    }

    componentDidMount = async () => {
        const { data } = await axios.get(`http://localhost:5000/users/${this.props.match.params.id}`)
        this.setState({
            name: data.name,
            email: data.email,
            avatar: data.avatar,
            role: data.role,
        })
        console.log(data)
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
        console.log(this.state.role)
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
        window.location = "/admin/users"
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
                    console.log(this.state.avatar)
                } else {
                    alert("failed")
                }
            })
    }
    render() {
        if (!isAuth() && isAuth().role !== 1) { return (<div>Unauthorized access!</div>) }
        else {
            return (
                <div>
                    <nav className="navbar navbar-expand-sm bg-light navbar-light">
                        <ul className="nav nav-tabs">
                            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/users">Users</Link></li>
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
                            <div className="form-group">
                                <label>Email:</label>
                                <input className="form-control" type="text" value={this.state.email} onChange={this.onChangeEmail} />
                            </div>

                            <div className="form-group">
                                <select className="form-control" onChange={(e) => this.onChangeRole(e.target.value)}>
                                    <option value="0">Select a role</option>
                                    <option value="0">User</option>
                                    <option value="1">Admin</option>
                                </select>
                            </div>
                            <input className="btn btn-primary" type="submit" value="Edit user" />
                        </form>
                    </div>
                </div>
            )
        }
    }
}
