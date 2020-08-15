class Companies {
    constructor() {
        this.companies = []
        this.adapter = new CompaniesAdapter()
        // this.bindEventh1steners()
        this.fetchAndLoadCompanies()
        this.bindingAndEventListener()
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

            let a = document.createElement('a')
            a.text = company.name
            a.href = `${company.url}`
            div.appendChild(a)

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

    bindingAndEventListener() {
        this.companyForm = document.getElementById('new-company')
        this.companyForm.addEventListener('submit', this.createCompany.bind(this))
        this.newCompanyName = document.getElementById('new-company-name')
    }

    createCompany(e) {
        e.preventDefault() // This prevents the default behavior. Anytime you submit a form, the default behavior is to refresh the page.

        const companyObject = {
            name: this.newCompanyName.value
        }

        this.adapter.createCompany(companyObject).then(company => {
            this.companies.push(new Company(company))
            this.render()
        })
    }
}