import React from 'react';
import DisplayUsers from './components/User/DisplayUsers'
import EditUser from './components/User/EditUser'
import UsersDisplayProducts from './components/Product/UsersDisplayProducts'
import DisplayProducts from './components/Product/DisplayProducts'
import AddProduct from './components/Product/AddProduct'
import EditProduct from './components/Product/EditProducts'
import AddCategories from './components/Category/AddCategory';
import DisplayCategories from './components/Category/DisplayCategories';
import EditCategories from './components/Category/EditCategory';
import Register from './components/Register/Register'
import Activate from './components/Activate/Activate'
import Login from './components/Login/Login'
import Reset from './components/ResetPassword/Reset';
import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import UserEditUser from './components/User/UserEditUser'
import Cart from './components/Cart/Cart'
import DetailProducts from './components/Product/DetailProducts';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Route } from 'react-router-dom'
import ProductsByCategory from './components/Product/ProductsByCategory';
import AllProducts from './components/Product/AllProducts';
import Home from './components/Home/Home';
import UserHome from './components/Home/UserHome';


export default class App extends React.Component {
  render() {
    return (

      <BrowserRouter>
        <Route path="/" component={Home} exact />
        <Route path="/home" component={AllProducts} exact />
        <Route path="/categories/:category" component={ProductsByCategory} exact />
        <Route path="/signUp" exact render={props => <Register {...props} />} />
        <Route path="/activate/:token" exact render={props => <Activate {...props} />} />
        <Route path="/login" exact render={props => <Login {...props} />} />
        <Route path="/password/forget" exact render={props => <ForgetPassword {...props} />} />
        <Route path="/password/reset/:token" exact render={props => <Reset {...props} />} />

        <Route path="/admin" exact component={DisplayProducts} />
        <Route path="/admin/products/add" component={AddProduct} />
        <Route path="/admin/products/edit/:id" component={EditProduct} />
        <Route path="/admin/categories" component={DisplayCategories} exact />
        <Route path="/admin/categories/add" component={AddCategories} />
        <Route path="/admin/categories/edit/:id" component={EditCategories} />
        <Route path="/admin/users" component={DisplayUsers} exact />
        <Route path="/admin/edit/:id" component={EditUser} />

        <Route path="/:usename/Home" component={UserHome} exact />
        <Route path="/users/:username/products/" exact component={UsersDisplayProducts} />
        <Route path="/users/:username/products/:id" exact component={DetailProducts} />
        <Route path="/users/:username/edit/:id" component={UserEditUser} />
        <Route path="/users/:username/cart" component={Cart} />
      </BrowserRouter>
    )
  }
}
