



class Auth {
    user;

    constructor() {
        this.user = JSON.parse(localStorage.user);
    }

    login() {

    }

    register() {

    }

    logout() {

    }

    get() {
        return JSON.parse(localStorage.user);
    }

    set(user) {
        const strUser = JSON.stringify(user);
        localStorage.user = user;
    }
}

const auth = new Auth();

export default auth;
