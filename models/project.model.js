export default class Project {
    constructor(id, title, description, technologies, githubLink, liveLink, image, createdAt) {
        this.title = title;
        this.description = description;
        this.technologies = technologies;
        this.githubLink = githubLink;
        this.liveLink = liveLink;
        this.image = image;
        this.createdAt = createdAt;
        this._id = id;
    }
}