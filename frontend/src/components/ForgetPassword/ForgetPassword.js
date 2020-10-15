import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const ForgetPassword = ({ history }) => {
    const [formData, setFormData] = useState({
        email: '',
        textChange: 'Submit'
    });
    const { email } = formData;
    const handleChange = text => e => {
        setFormData({ ...formData, [text]: e.target.value });
    };
    const handleSubmit = e => {
        e.preventDefault();
        if (email) {
            setFormData({ ...formData, textChange: 'Submitting' });
            axios
                .put(`http://localhost:5000/password/forgot`, {
                    email
                })
                .then(res => {

                    setFormData({
                        ...formData,
                        email: '',
                    });
                    toast.success(`Please check your email`);

                })
                .catch(err => {
                    console.log(err.response)
                    toast.error(err.response.data.error);
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
                        <div className="card card-signin my-5  border border-primary">
                            <div className="card-body"></div>
                            <h5 className="card-title text-center">Forget password</h5>
                            <form className="form-signin" onSubmit={handleSubmit}>
                                <div className="form-label-group">
                                    <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus onChange={handleChange('email')} value={email} />
                                    <label htmlFor="inputEmail">Email address</label>
                                </div>
                                <button className="btn btn-primary btn-block text-uppercase" type="submit">Send verification email</button>
                                <hr></hr>
                                <a href='/login' target='_self'>
                                    <span style={{ color: "#000", display: "block", textAlign: "center" }}>Sign in</span>
                                </a>
                                <a href='/' target='_self'>
                                    <span style={{ color: "#000", display: "block", textAlign: "center",paddingBottom: "20px" }}>Back to website</span>
                                </a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassword