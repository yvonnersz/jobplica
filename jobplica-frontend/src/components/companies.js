class Companies {
    constructor() {
        this.companies = []
        this.adapter = new CompaniesAdapter()
        // this.bindEventh1steners()
        this.fetchAndLoadCompanies()
    }

    fetchAndLoadCompanies() {
        this.adapter.getCompanies()
            .then(companies => { 
                companies.forEach(company => this.companies.push(new Company(company)))
            }).then (() => {
                this.render()
            })
    }

    render() {
        let companiesContainer = document.querySelector('.company')

        for (const company of this.companies) {
            let div = document.createElement('div')
            div.setAttribute('id', company.id)
            div.className = "company-card"

            let h1 = document.createElement('h1')
            div.appendChild(h1).innerHTML = company.name

            let ul = document.createElement('ul')

            let locationLi = document.createElement('li')
            ul.appendChild(locationLi).innerHTML = company.location

            let dateLi = document.createElement('li')
            ul.appendChild(dateLi).innerHTML = company.renderDate()

            let takeawayLi = document.createElement('li')
            ul.appendChild(takeawayLi).innerHTML = company.takeaway

            let statusLi = document.createElement('li')
            ul.appendChild(statusLi).innerHTML = company.status

            let companyInfo = div.appendChild(ul)

            let responseButton = document. createElement("button");
            responseButton.innerHTML = "Response"
            div.appendChild(responseButton)

            let noReplyButton = document. createElement("button");
            noReplyButton.innerHTML = "No Reply"
            div.appendChild(noReplyButton)

            let rejectedButton = document. createElement("button");
            rejectedButton.innerHTML = "Rejected"
            div.appendChild(rejectedButton)

            companiesContainer.appendChild(div)
        }
    }
}