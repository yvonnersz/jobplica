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

            let locationUl = document.createElement('ul')
            div.appendChild(locationUl).innerHTML = company.location

            let dateUl = document.createElement('ul')
            div.appendChild(dateUl).innerHTML = company.date_applied

            let takeawayUl = document.createElement('ul')
            div.appendChild(takeawayUl).innerHTML = company.takeaway

            let statusUl = document.createElement('ul')
            div.appendChild(statusUl).innerHTML = company.status

            let companyCard = companiesContainer.appendChild(div)
        }
    }
}