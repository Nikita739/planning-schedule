export interface IFormValidationError {
    message?: string,
    result: boolean
}

export const validateEmail = (email: string): IFormValidationError => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    // return !!email.match(emailRegex);
    if(email.match(emailRegex)) {
        return {
            message: "",
            result: true
        };
    } else {
        return {
            message: "Email not correct",
            result: false
        };
    }
}

export const validatePassword = (password: string): IFormValidationError => {
    if(password.length < 6) {
        return {
            message: "Password length must be at least 6 characters long",
            result: false
        };
    }

    return {
        message: "",
        result: true
    };
}

export const validateUsername = (username: string): IFormValidationError => {
    if(username.length < 4) {
        return {
            message: "Username length must be at least 4 characters long",
            result: false
        };
    }

    return {
        message: "",
        result: true
    };
}