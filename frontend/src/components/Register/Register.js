import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { isAuth } from '../../helpers/auth'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import './Register.css'
import 'react-toastify/dist/ReactToastify.css'


const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password1: "",
        password2: ""
    })
    const { email, name, password1, password2 } = formData
    const handleChange = text => e => {
        setFormData({ ...formData, [text]: e.target.value })
    }
    const handleSubmit = e => {
        e.preventDefault()
        if (name && email && password1) {
            if (password1 === password2) {
                axios.post("http://localhost:5000/signUp", {
                    name, email, password: password1
                }).then(res => {
                    setFormData({
                        ...formData,
                        name: "",
                        email: "",
                        password1: "",
                        password2: ""
                    })
                    toast.success(res.data.message)
                }).catch(err => {
                    toast.error(err.response.data.error)
                })
            } else {
                toast.error("Passwords do not match")
            }
        } else {
            toast.error("Fill all fields")
        }
    }
    return (
            <div className='container'>
                {isAuth() ? <Redirect to='/' /> : null}
                <ToastContainer />
                <div className="row">
                    <div className="col-md-7 col-lg-5 mx-auto">
                        <div className="card card-signin my-5 border border-primary">
                            <div className="card-body"></div>
                            <h5 className="card-title text-center">Sign Up</h5>
                            <form className="form-signin" onSubmit={handleSubmit}>
                                <div className="form-label-group">
                                    <input type="text" id="input-username" className="form-control" placeholder="Username" value={name} onChange={handleChange('name')} required autoFocus/>
                                    <label for="input-username">Username</label>
                                </div>

                                <div className="form-label-group">
                                    <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required onChange={handleChange('email')} value={email} />
                                    <label for="inputEmail">Email address</label>
                                </div>

                                <div className="form-label-group">
                                    <input type="password" id="inputPassword" className="form-control" placeholder="Password" required onChange={handleChange('password1')} value={password1} />
                                    <label for="inputPassword">Password</label>
                                </div>

                                <div className="form-label-group">
                                    <input type="password" id="verify-password" className="form-control" placeholder="Password" required onChange={handleChange('password2')} value={password2} />
                                    <label for="verify-password">Verify password</label>
                                </div>

                                <button className="btn btn-primary btn-block text-uppercase" type="submit">Sign up</button>
                                <hr className="my-4"></hr>
                                <a href='/login' target='_self'>
                                    <span style={{ color: "#000", display: "block", textAlign: "center" }}>Sign in</span>
                                </a>
                                <a href='/' target='_self'>
                                    <span style={{ color: "#000", display: "block", textAlign: "center", paddingBottom:"20px" }}>Back to website</span>
                                </a>
                                
                            </form>
                        </div>
                    </div>
                </div>
            </div >
    )
}

export default Register;