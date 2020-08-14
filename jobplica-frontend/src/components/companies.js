class Companies {
    constructor() {
        this.companies = []
        this.adapter = new CompaniesAdapter()
        // this.bindEventulsteners()
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

            let card = companiesContainer.appendChild(div)

            let ul = document.createElement('ul')        
            let appendUl = card.appendChild(ul)

            appendUl.innerHTML = company.name
        }
    }
}