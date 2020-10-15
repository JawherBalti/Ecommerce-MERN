import cookie from 'js-cookie'

export const setCookie = (key, value) => {
    if (window !== 'undefined') {
        cookie.set(key, value, {
            expires: 1
        })
    }
}

export const removeCookie = key => {
    if (window !== 'undefined') {
        cookie.remove(key, {
            expires: 1
        })
    }
}

export const getCookie = key => {
    if (window !== 'undefined') {
        return cookie.get(key)
    }
}

export const setLocalStorage = (key, value) => {
    if (window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value))
    }
}

export const removeLocalStorage = key => {
    if (window !== 'undefined') {
        localStorage.removeItem(key)
    }
}

export const authenticate = (response, next) => {
    //setCookie('w_auth_token', response.data.token)
    setLocalStorage('user', response.data.user)
    setLocalStorage('w_auth_token', response.data.token)
    next()
}

export const signout = next => {
    removeCookie("w_auth_token")
    removeLocalStorage("user")
    removeLocalStorage("w_auth_token")
}

export const isAuth = () => {
    if (window !== "undefined") {
        const tokenChecked =JSON.parse(localStorage.getItem("w_auth_token"))
        if (tokenChecked) {
            if (localStorage.getItem("user")) {
                return JSON.parse(localStorage.getItem("user"))
            } else {
                return false
            }
        }
    }
}

export const updateUser = (response, next) => {
    if (window !== 'undefined') {
        let auth = JSON.parse(localStorage.getItem("user"))
        auth = response.data
        localStorage.setItem("user", JSON.stringify(auth))
    }
    next()
}

export const logout = async () => {
    if (isAuth) {
        signout();
    }
}