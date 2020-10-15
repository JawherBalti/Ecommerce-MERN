import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { isAuth, logout } from '../../helpers/auth';

export default class DisplayCategories extends Component {
    state = {
        categories: []
    }

    componentDidMount = async () => {
        const { data } = await axios.get("http://localhost:5000/categories")
        this.setState({
            categories: data
        })
    }

    deleteCategory = async (id) => {
        await axios.delete(`http://localhost:5000/categories/delete/${id}`)
        this.setState({
            categories: this.state.categories.filter(category => {
                return (
                    category._id !== id
                )
            })
        })
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
                            <li className="nav-item"><Link className="nav-link active" to="/admin/categories">Categories</Link></li>
                            <li className="nav-item"><Link className="nav-link" to="/admin/categories/add">Add categories</Link></li>
                        </ul>
                        <ul className="nav nav-tabs navbar-nav ml-auto">
                            <li className="nav-item"><a onClick={logout} className="nav-link" href="/"><span className="glyphicon glyphicon-log-in"></span> Log out</a></li>
                        </ul>
                    </nav >
                    <div className="container">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.categories.map((category, i) => {
                                    return (
                                        <tr key={i}>
                                            <th>{category.name}</th>
                                            <td><Link to={`/admin/categories/edit/${category._id}`}>Edit</Link> / <Link to="/admin/categories" onClick={() => this.deleteCategory(category._id)}>Delete</Link></td>
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
