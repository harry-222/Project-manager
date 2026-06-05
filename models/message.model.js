export default class Message {
    constructor( name, email, subject, message, createdAt, id ) {
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
        this.createdAt = createdAt;
        this._id = id;
    }
}
