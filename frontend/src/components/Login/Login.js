
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { authenticate, isAuth } from '../../helpers/auth';
import { Link } from 'react-router-dom';
import './Login.css'


const Login = ({ history }) => {
    const [formData, setFormData] = useState({
        email: '',
        password1: '',
    });
    const { email, password1 } = formData;
    const handleChange = text => e => {
        setFormData({ ...formData, [text]: e.target.value });
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (email && password1) {
            axios.post(`http://localhost:5000/login`, { email, password: password1 })
                .then(res => {
                    authenticate(res, () => {
                        setFormData({
                            ...formData,
                            email: '',
                            password1: '',
                        });
                        isAuth() && isAuth().role === 1
                            ? history.push('/admin')
                            : history.push(`/${JSON.parse(localStorage.getItem("user")).name}/Home`);
                        toast.success(`Hey ${res.data.user.name}, Welcome back!`);
                    });
                })
                .catch(err => {
                    setFormData({ ...formData, email: '', password1: '' });
                });
        } else {
            toast.error('Please fill all fields');
        }
    };
    return (
        <div>
            <div className='container'>
                <ToastContainer />
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card card-signin my-5 border border-primary">
                            <div className="card-body"></div>
                            <h5 className="card-title text-center">Sign In</h5>
                            <form className="form-signin" onSubmit={handleSubmit}>
                                <div className="form-label-group">
                                    <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus onChange={handleChange('email')} value={email} />
                                    <label htmlFor="inputEmail">Email address</label>
                                </div>

                                <div className="form-label-group">
                                    <input type="password" id="inputPassword" className="form-control" placeholder="Password" required onChange={handleChange('password1')} value={password1} />
                                    <label htmlFor="inputPassword">Password</label>
                                </div>

                                <button className="btn btn-primary btn-block text-uppercase" type="submit">Sign in</button>
                                <Link style={{ color: "#000", display: "block", textAlign: "center" }} to='/password/forget'>Forgot password?</Link>
                                <hr className="my-4"></hr>

                                <a href='/signup' target='_self'>
                                    <span style={{ color: "#000", display: "block", textAlign: "center" }}>Create an account</span>
                                </a>
                                <a href='/' target='_self'>
                                    <span style={{ color: "#000", display: "block", textAlign: "center", paddingBottom: "20px" }}>Back to website</span>
                                </a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;