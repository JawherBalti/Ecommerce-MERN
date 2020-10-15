"user strinct"
const uniqueMessage = error => {
    let output
    try {
        let fieldName = error.message.split(".$")[1]
        field = field.split("dub key")[0]
        field = field.substring(0, field.lastIndexOf("_"))
        require.flash("errors", [{
            message: "An account with this " + field + "already exists"
        }])
        output = fieldName.charAt(0).toUppserCase() + fieldName.slice(1) + "already exists"
    } catch (err) {
        output = "already exists"
    }
    return output
}

exports.errorHandler = error => {
    let message = ""
    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error)
                break
            default:
                message = "something went wrong"
        }
    } else {
        for (let errorName in error.errors) {
            if (error.errors[errorName].message) {
                message = error.errors[errorName].message
            }
        }
    }
return message
}