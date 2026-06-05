export default class User {
    constructor(id, username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this._id = id;
    }
}