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
                companies.sort((a, b) => a.id - b.id).forEach(company => this.companies.push(new Company(company)))
            }).then (() => {
                this.render()
            })
    }

    render() {
        let companiesContainer = document.querySelector('.company')

        for (const company of this.companies) {
            let div = document.createElement('div')
            div.setAttribute('id', 'container-' + company.id)
            div.className = "company-card"

            let editDiv = document.createElement('button')
            editDiv.className = "edit"
            editDiv.setAttribute('id', 'edit-' + company.id)
            editDiv.innerHTML = 'Edit'
            editDiv.addEventListener('click', this.updateCompany.bind(this))
            div.appendChild(editDiv)

            let deleteButton = document.createElement('button')
            deleteButton.className = "delete"
            deleteButton.setAttribute('id', 'delete-' + company.id)
            deleteButton.innerHTML = "Delete"
            deleteButton.style.visibility = "hidden"
            div.appendChild(deleteButton)

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
            date_applied: this.newCompanyDate.value,
            takeaway: this.newCompanyTakeaway.value,
            status: this.newCompanyStatus.value
        }

        this.adapter.createCompany(companyObject).then(company => {
            this.companies.push(new Company(company))
            this.render()
        })
    }

    updateCompany(e) {
        let savedThis = this
        let selectedId = e.target.id.split('-')[1]
        let editContainer = document.querySelector(`#container-${selectedId}`)

        let editButton = document.querySelector(`#edit-${selectedId}`)
        editButton.style.visibility = "hidden"

        let deleteButton = document.querySelector(`#delete-${selectedId}`)
        deleteButton.style.visibility = "visible"

        editContainer.addEventListener('dblclick', function(e) {
            let edit = e.target

            edit.contentEditable = true
            edit.addEventListener('keydown', function(e) {
                if (event.key == "Enter") {
                    const newValue = edit.innerHTML

                    let companyName = document.querySelector(`#container-${selectedId} a`).innerText
                    let companyUrl = document.querySelector(`#container-${selectedId} a`).href
                    let companyLocation = document.querySelector(`#container-${selectedId} ul li:nth-child(1)`).innerText
                    let companyDate = document.querySelector(`#container-${selectedId} ul li:nth-child(2)`).innerText
                    let companyTakeaway = document.querySelector(`#container-${selectedId} ul li:nth-child(3)`).innerText
                    let companyResponse = document.querySelector(`#container-${selectedId} ul li:nth-child(4)`).innerText

                    let newCompanyObject = {
                        name: companyName,
                        location: companyLocation,
                        url: companyUrl,
                        date_applied: companyDate,
                        takeaway: companyTakeaway,
                        status: companyResponse
                    }

                    savedThis.adapter.updateCompany(newCompanyObject, newValue, selectedId)
                    edit.contentEditable = false
                }
            })
        })
    }
}