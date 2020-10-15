import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { isAuth } from '../../helpers/auth';
import { Redirect } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css'

const Activate = ({ match }) => {
    const [formData, setFormData] = useState({
        name: '',
        token: '',
        show: true
    });

    useEffect(() => {
        let token = match.params.token;
        let { name } = jwt.decode(token);

        if (token) {
            setFormData({ ...formData, name, token });
        }

        console.log(token, name);
    }, [match.params]);
    const { name, token } = formData;

    const handleSubmit = e => {
        e.preventDefault();

        axios.post(`http://localhost:5000/activate`, {token})
            .then(res => {
                setFormData({
                    ...formData,
                    show: false
                });
                toast.success(res.data.message);
            })
            .catch(err => {
                toast.error(err.response.data.errors);
            });
    };

    return (
        <div>
            <div className="container">
                {isAuth() ? <Redirect to='/' /> : null}
                <ToastContainer />
                <h1>Welcome {name}! Click the button to activate your account.</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type='submit' className="btn btn-primary" value="activate" />
                    </div>
                        <a href='/login' target='_self'>Sign in</a>
                </form>
            </div>
        </div>
    );
};

export default Activate;