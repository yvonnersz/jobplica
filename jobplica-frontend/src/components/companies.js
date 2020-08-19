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
            div.setAttribute('id', "edit-" + company.id)
            div.className = "company-card"

            let editDiv = document.createElement('button')
            editDiv.className = "edit"
            editDiv.setAttribute('id', company.id)
            editDiv.innerHTML = 'Edit'
            editDiv.addEventListener('click', this.editCompany.bind(this))
            div.appendChild(editDiv)

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
        this.newCompanyLocation = document.getElementById('new-company-location')
        this.newCompanyUrl = document.getElementById('new-company-url')
        this.newCompanyDate = document.getElementById('new-company-date')
        this.newCompanyTakeaway = document.getElementById('new-company-takeaway')
        this.newCompanyStatus = document.getElementById('new-company-status')
    }

    createCompany(e) {
        e.preventDefault() // This prevents the default behavior. Anytime you submit a form, the default behavior is to refresh the page.

        const companyObject = {
            name: this.newCompanyName.value,
            location: this.newCompanyLocation.value,
            url: this.newCompanyUrl.value,
            date: this.newCompanyDate.value,
            takeaway: this.newCompanyTakeaway.value,
            status: this.newCompanyStatus.value
        }

        this.adapter.createCompany(companyObject).then(company => {
            this.companies.push(new Company(company))
            this.render()
        })
    }

    editCompany(e) {
        console.log(e.target)

        let selectedId = e.target.id

        let editContainer = document.querySelector('#edit-' + selectedId)

        editContainer.addEventListener('dblclick', function(e) {
            let edit = e.target
            edit.contentEditable = true
            edit.addEventListener('keydown', function(e) {
                if (event.key == "Enter") {
                    console.log("update")
                    edit.contentEditable = false
                }
            })
        })
    }
}