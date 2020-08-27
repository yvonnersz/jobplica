class Company {
    // This below builds out the attributes so that you can access them.
    constructor(company) {
        this.id = company.id;
        this.name  = company.name;
        this.location = company.location;
        this.url = company.url;
        this.date_applied = company.date_applied;
        this.status = company.status;
        this.comments = company.comments;
    }

    renderDate() {
        let date = new Date(this.date_applied)
        let fullDate = date.toDateString()
        return fullDate
    }
}