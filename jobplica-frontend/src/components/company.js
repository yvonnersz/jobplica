class Company {
    constructor(company) {
        this.id = company.id;
        this.name  = company.name;
        this.location = company.location;
        this.url = company.url;
        this.date_applied = company.date_applied;
        this.status = company.status;
        this.comments = company.comments;
    }

    get renderDate() {
        let date = new Date(this.date_applied)
        let fullDateSplit = date.toUTCString().split(' ')
        let day = fullDateSplit[1]
        let month = fullDateSplit[2]
        let year = fullDateSplit[3]

        let fullDate = month + " " + day + " " + year
        return fullDate
    }
}