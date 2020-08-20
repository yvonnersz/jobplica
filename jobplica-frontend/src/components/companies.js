class Companies {
    constructor() {
        this.companies = []
        this.adapter = new CompaniesAdapter()
        this.fetchAndLoadCompanies()
        this.bindingAndEventListener()
    }

    fetchAndLoadCompanies() {
        this.adapter.getCompanies()
            .then(companies => { 
                companies.forEach(company => this.companies.push(new Company(company)))
            }).then (() => {
                this.render()
                this.filterStatus()
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
            editDiv.addEventListener('focus', this.updateCompany.bind(this))
            div.appendChild(editDiv)

            let deleteButton = document.createElement('button')
            deleteButton.className = "delete"
            deleteButton.setAttribute('id', 'delete-' + company.id)
            deleteButton.innerHTML = "Delete"
            deleteButton.style.display = "none"
            div.appendChild(deleteButton)

            let a = document.createElement('a')
            a.text = company.name
            a.href = `${company.url}`
            div.appendChild(a)

            let companyUrl = document.createElement('li')
            companyUrl.setAttribute('id', 'url-' + company.id)
            companyUrl.style.display = "none"
            div.appendChild(companyUrl).innerHTML = company.url

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
            responseButton.setAttribute('id', 'approved-' + company.id)
            responseButton.addEventListener('click', this.responseResponse.bind(this))
            div.appendChild(responseButton)

            let rejectedButton = document. createElement("button");
            rejectedButton.innerHTML = "Rejected"
            rejectedButton.setAttribute('id', 'rejected-' + company.id)
            rejectedButton.addEventListener('click', this.rejectedResponse.bind(this))
            div.appendChild(rejectedButton)


            companiesContainer.appendChild(div)

            // Changes background color depending on status.
            // if (company.status == "Approved") {
            //     div.style.backgroundColor = "green"
            // } else if (company.status == "Rejected") {
            //     div.style.backgroundColor = "red"
            // }
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

        let displayUrl = document.querySelector(`li#url-${selectedId}`)
        displayUrl.style.display = null
        displayUrl.style.visibility = "visible"
        displayUrl.style.overflow = 'hidden'

        let editButton = document.querySelector(`#edit-${selectedId}`)
        editButton.style.display = "none"

        let deleteButton = document.querySelector(`#delete-${selectedId}`)
        deleteButton.style.display = null
        deleteButton.style.visibility = "visible"
        deleteButton.addEventListener('click', this.deleteCompany.bind(this))

        // Exits out of edit

        window.addEventListener('dblclick', function(e) {   
            if (editContainer.contains(e.target)){
                let edit = e.target

                // if edit button = none then contenteditable is true
                if (editButton.style.display === "none") {
                    edit.contentEditable = true

                }
                // end
                
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
            } else{
                editButton.style.display = null
                editButton.style.visibility = "visible"
                deleteButton.style.display = "none"
                e.target.contentEditable = false
                displayUrl.style.display = "none"
            }
          });
    }

    deleteCompany(e) {
        let savedThis = this
        let selectedId = e.target.id.split('-')[1]

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

        savedThis.adapter.deleteCompany(newCompanyObject, selectedId)

        let cards = document.querySelector('.company')
        let card = document.querySelector(`#container-${selectedId}`)
        cards.removeChild(card)
    }

    rejectedResponse(e) {
        e.preventDefault
        
        let savedThis = this
        let selectedId = e.target.id.split('-')[1]

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
            status: "Rejected"
        }

        savedThis.adapter.rejectedStatusUpdate(newCompanyObject, selectedId)

        // Change company card's response to "Rejected"
        document.querySelector(`#container-${selectedId} ul li:nth-child(4)`).innerText = "Rejected"

        let companyCard = document.querySelector(`#container-${selectedId}`)
        companyCard.className = "rejected-card"
    }

    responseResponse(e) {
        e.preventDefault
        
        let savedThis = this
        let selectedId = e.target.id.split('-')[1]

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
            status: "Approved"
        }

        savedThis.adapter.approvedStatusUpdate(newCompanyObject, selectedId)

        // Change company card's response to "Approved"
        document.querySelector(`#container-${selectedId} ul li:nth-child(4)`).innerText = "Approved"

        let companyCard = document.querySelector(`#container-${selectedId}`)
        companyCard.className = "approved-card"
    }

    filterStatus() {
        let companies = this.companies
    
        document.querySelector('#status-dropdown').addEventListener('change', function(e) {

            let companyContainer = document.querySelector('.company')
            let companyCards = document.querySelectorAll('.company-card')
            
            for (let companyCard of companyCards) {
                companyCard.style.display = "none"
            }
            
            let statusPick = document.querySelector('#status-dropdown').value

            for (let companyCard of companyCards) {
                let companyId = companyCard.id.split('-')[1]
                let companyResponse = companyCard.querySelector(`ul li:nth-child(4)`).innerText

                if (companyResponse == statusPick) {
                    companyCard.style.display = null
                    companyCard.style.visibility = "visible"
                } else if (statusPick == "All") {
                    for (let companyCard of companyCards) {
                        companyCard.style.display = null
                        companyCard.style.visibility = "visible"
                    }
                }
            }



        })
    }
}