import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'

const Reset = ({ match }) => {
    const [formData, setFormData] = useState({
        password1: '',
        password2: '',
        token: '',
        textChange: 'Submit'
    });
    const { password1, password2, token } = formData;

    useEffect(() => {
        let token = match.params.token
        if (token) {
            setFormData({ ...formData, token })
        }

    }, [])
    const handleChange = text => e => {
        setFormData({ ...formData, [text]: e.target.value });
    };
    const handleSubmit = e => {
        console.log(password1, password2)
        e.preventDefault();
        if ((password1 === password2) && password1 && password2) {
            axios.put(`http://localhost:5000/password/reset`, { newPassword: password1, resetPasswordLink: token })
                .then(res => {
                    console.log(res.data.message)
                    setFormData({
                        ...formData,
                        password1: '',
                        password2: ''
                    });
                    toast.success(res.data.message);

                })
                .catch(err => {
                    toast.error(err.response.data.error);
                });
        } else {
            toast.error('Passwords don\'t matches');
        }
    };

    return (
        <div style={{ backgroundColor: "#f7fbff" }}>
            <div className='container'>
                <ToastContainer />
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card card-signin my-5">
                            <div className="card-body"></div>
                            <h5 className="card-title text-center">Reset your password</h5>
                            <div className='w-full flex-1 mt-8 text-indigo-500'>
                                <form className="form-signin" onSubmit={handleSubmit}>
                                    <div className="form-label-group">
                                        <input type="password" id="inputPassword1" className="form-control" placeholder="Password" value={password1} onChange={handleChange('password1')} />
                                        <label htmlFor="inputPassword1">Password</label>
                                    </div>
                                    <div className="form-label-group">
                                        <input type="password" id="inputPassword2" className="form-control" placeholder="Password" value={password2} onChange={handleChange('password2')} />
                                        <label htmlFor="inputPassword1">Confirm password</label>
                                    </div>
                                    <button className="btn btn-primary btn-block text-uppercase" type="submit">Submit</button>
                                    <a href='/login' target='_self'>
                                        <span style={{ color: "#000", display: "block", textAlign: "center" }}>Sign in</span>
                                    </a>
                                    <a href='/' target='_self'>
                                        <span style={{ color: "#000", display: "block", textAlign: "center" }}>Back to website</span>
                                    </a>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reset
