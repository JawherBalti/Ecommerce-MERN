import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { isAuth, logout } from '../../helpers/auth';

export default class DisplayUsers extends Component {
    state = {
        users: []
    }

    componentDidMount = async () => {
        const { data } = await axios.get("http://localhost:5000/users")
        this.setState({
            users: data
        })
    }

    deleteUser = async (id) => {
        await axios.delete(`http://localhost:5000/users/delete/${id}`)
        this.setState({
            users: this.state.users.filter(user => {
                return (
                    user._id !== id
                )
            })
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
                            <li className="nav-item"><Link className="nav-link active" to="/admin/users">Users</Link></li>
                        </ul>

                        <ul className="nav nav-tabs navbar-nav ml-auto">
                            <li className="nav-item"><a onClick={logout} className="nav-link" href="/"><span className="glyphicon glyphicon-log-in"></span> Log out</a></li>
                        </ul>
                    </nav >
                    <div className="container">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Avatar</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.users.map((user, i) => {
                                    return (
                                        <tr key={i}>
                                            <th>{user.name}</th>
                                            <th>{user.email}</th>
                                            <td><a href={`http://localhost:5000/${user.avatar}`}><img alt="" style={{ height: "30px", width: "70px" }} src={`http://localhost:5000/${user.avatar}`} /></a></td>
                                            <th>{user.role}</th>
                                            <td><Link to={`/admin/edit/${user._id}`}>Edit</Link>/<Link to="/admin/users" onClick={() => this.deleteUser(user._id)}>Delete</Link></td>

                                        </tr>
                                    )
                                })}

                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }
    }
}
