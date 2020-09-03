let companyCardsContainer = document.querySelector('.company-cards')

class Companies {
    constructor() {
        this.adapterCompanies = new CompaniesAdapter()
        this.adapterComments = new CommentsAdapter()
        this.fetchCompanies()
        this.bindEventListeners()
    }

    bindEventListeners() {
        let companyForm = document.getElementById('new-company')
        let filterByStatus = document.querySelector('#status-dropdown')
        let filterByDate = document.querySelector('#date-dropdown')
        let statisticsContainer = document.querySelector('.statistics')
        let cardsButton = document.querySelector('.cards-click')
        let statisticsButton = document.querySelector('.statistics-click')

        companyForm.addEventListener('submit', this.createCompany.bind(this))
        filterByStatus.addEventListener('change', this.filter.bind(this))
        filterByDate.addEventListener('change', this.filter.bind(this))
        cardsButton.addEventListener('click', this.showContent.bind(this))
        statisticsButton.addEventListener('click', this.showContent.bind(this))

        statisticsContainer.style.display = 'none'
        cardsButton.style.display = 'none'
    }

    fetchCompanies() {
        this.adapterCompanies.getCompanies().then(companies => { 
            this.render(companies)
        })
    }

    render(companies) {
        let companiesContainer = document.querySelector('.company-cards')

        for (const company of companies) {

            // Create company card div.

            let cardDiv = document.createElement('div')
            cardDiv.className = "company-card"
            cardDiv.setAttribute('id', 'card-' + company.id)

            // Create edit and delete buttons for company card.

            let editCardDiv = document.createElement('div')
            let editButton = document.createElement('button')
            let deleteButton = document.createElement('button')

            editCardDiv.className = 'company-edit'
            editButton.className = "edit-company-button"
            editButton.innerHTML = '...'
            deleteButton.className = "delete-company-button"
            deleteButton.innerHTML = "Delete"
            deleteButton.style.display = 'none'

            editButton.addEventListener('focus', this.buttonEditCompany.bind(this))
            deleteButton.addEventListener('click', this.deleteCompany.bind(this))

            editCardDiv.appendChild(editButton)
            editCardDiv.appendChild(deleteButton)
            cardDiv.appendChild(editCardDiv)

            // Create company info elements such as: name, url, location, date, and status.

            let companyInfoDiv = document.createElement('div')
            let companyHead = document.createElement('a')
            let ulCompanyInfo = document.createElement('ul')
            let liName = document.createElement('li')
            let liUrl = document.createElement('li')
            let liLocation = document.createElement('li')
            let liDate = document.createElement('li')
            let liStatus = document.createElement('li')

            companyInfoDiv.className = "company-info"
            companyHead.href = company.url
            liName.style.display = 'none'
            liUrl.style.display = 'none'

            ulCompanyInfo.appendChild(liName).innerHTML = company.name
            ulCompanyInfo.appendChild(liUrl).innerHTML = company.url
            ulCompanyInfo.appendChild(liLocation).innerHTML = company.location
            ulCompanyInfo.appendChild(liDate).innerHTML = new Company(company).renderDate
            ulCompanyInfo.appendChild(liStatus).innerHTML = company.status
            companyInfoDiv.appendChild(companyHead).innerHTML = company.name
            companyInfoDiv.appendChild(ulCompanyInfo)
            cardDiv.appendChild(companyInfoDiv)

            // Appending comments to the company card.

            let divComments = document.createElement('div')
            divComments.className = 'company-comments'

            let ulComments = document.createElement('ul')

            for (let comment of company.comments) {
                let commentLi = document.createElement('li')
                commentLi.setAttribute('id', 'comment-' + comment.id)
                ulComments.appendChild(commentLi).innerHTML = comment.content

                let deleteButton = document.createElement('button')
                deleteButton.innerHTML = "x"
                deleteButton.setAttribute('id', 'delete-comment-' + comment.id)
                deleteButton.className = 'delete-comment-button'
                deleteButton.addEventListener('click', this.deleteComment.bind(this))
                commentLi.appendChild(deleteButton)
            }

            divComments.appendChild(ulComments)
            cardDiv.appendChild(divComments)

            // Appending buttons to update company card.

            let updateCompanyDiv = document.createElement('div')
            updateCompanyDiv.className = 'company-update'

            let acceptButton = document.createElement("button");
            acceptButton.innerHTML = "Accepted"
            acceptButton.setAttribute('id', 'accept-company-' + company.id)
            acceptButton.className = 'response-button'
            acceptButton.addEventListener('click', this.updateCompanyStatus.bind(this))
            updateCompanyDiv.appendChild(acceptButton)

            let rejectButton = document.createElement("button");
            rejectButton.innerHTML = "Rejected"
            rejectButton.setAttribute('id', 'reject-company-' + company.id)
            rejectButton.className = 'response-button'
            rejectButton.addEventListener('click', this.updateCompanyStatus.bind(this))
            updateCompanyDiv.appendChild(rejectButton)

            let commentButton = document.createElement('button')
            commentButton.innerHTML = "Leave a Comment"
            commentButton.className = 'comment-button'
            commentButton.setAttribute('id', 'comment-' + company.id)
            commentButton.addEventListener('click', this.buttonComment.bind(this))
            updateCompanyDiv.appendChild(commentButton)

            let commentForm = document.createElement('input')
            commentForm.style.display = 'none'
            updateCompanyDiv.appendChild(commentForm)

            let commentSubmitButton = document.createElement('input')
            commentSubmitButton.setAttribute('type', 'submit')
            commentSubmitButton.className = 'submit-comment-button'
            commentSubmitButton.style.display = 'none'
            commentSubmitButton.addEventListener('click', this.createComment.bind(this))
            updateCompanyDiv.appendChild(commentSubmitButton)

            let exitSubmit = document.createElement('input')
            exitSubmit.className = 'exit-comment-button'
            exitSubmit.setAttribute('type', 'submit')
            exitSubmit.value = "Exit"
            exitSubmit.style.display = 'none'
            exitSubmit.addEventListener('click', this.buttonComment.bind(this))
            updateCompanyDiv.appendChild(exitSubmit)

            cardDiv.appendChild(updateCompanyDiv)
            companiesContainer.appendChild(cardDiv)

            // Changes background color depending on status.

            // if (company.status == "Accepted") {
            //     div.style.backgroundColor = "#239B56"
            //     rejectedButton.style.display = "none"
            //     responseButton.style.display = "none"
            // } else if (company.status == "Rejected") {
            //     div.style.backgroundColor = "#E74C3C"
            //     rejectedButton.style.display = "none"
            //     responseButton.style.display = "none"
            // }
        }
    }

    createCompany(e) {
        // After submitting a form, the default behavior is to refresh the page. The following line prevents that.
        e.preventDefault();

        let newCompanyName = document.getElementById('new-company-name')
        let newCompanyLocation = document.getElementById('new-company-location')
        let newCompanyUrl = document.getElementById('new-company-url')
        let newCompanyDate = document.getElementById('new-company-date')

        const newCompany = {
            name: newCompanyName.value,
            location: newCompanyLocation.value,
            url: newCompanyUrl.value,
            date_applied: newCompanyDate.value,
        }

        this.adapterCompanies.createCompany(newCompany).then(company => {
            this.render(new Array(company));

            // Clearing the form values.
            newCompanyName.value = null
            newCompanyLocation.value = null
            newCompanyUrl.value = null
            newCompanyDate.value = null
        })
    }

    buttonEditCompany(e) {
        let companyCards = this
        let companyId = e.target.parentNode.parentNode.id.split('-')[1]
        let companyCard = document.querySelector(`#card-${companyId}`)
        let editButton = companyCard.querySelector(`.edit-company-button`)
        let deleteButton = companyCard.querySelector(`.delete-company-button`)
        let companyInfoDiv = document.querySelector(`#card-${companyId}`).childNodes[1]
        let companyAnchor = companyInfoDiv.querySelector('a')
        let companyName = companyInfoDiv.querySelector('ul').childNodes[0]
        let companyUrl = companyInfoDiv.querySelector('ul').childNodes[1]

        editButton.style.display = "none"
        deleteButton.style.display = null
        companyAnchor.style.display = 'none'
        companyName.style.display = null
        companyUrl.style.display = null

        // The code below does the following:
        // User will be able to edit content if content is double-clicked within card.
        // Else the edit buttons will default to default card position.

        window.addEventListener('dblclick', function(e) {   
            if (companyInfoDiv.contains(e.target)) {
                companyCards.updateCompany(e)
            } else {
              e.target.contentEditable = false
              editButton.style.display = null
              deleteButton.style.display = "none"
              companyAnchor.style.display = null
              companyName.style.display = 'none'
              companyUrl.style.display = "none"
            }
        })
    }

    updateCompany(e) {
        let companyId = e.target.parentNode.parentNode.parentNode.id.split('-')[1]
        let companyInfoDiv = document.querySelector(`#card-${companyId}`).childNodes[1]
        let companyAnchor = companyInfoDiv.querySelector('a')
        let companyCards = this
        let editInfo = e.target

        editInfo.contentEditable = true

        editInfo.addEventListener('keydown', function(e) {
            if (e.key == "Enter") {
                let companyNameValue = companyInfoDiv.querySelector('ul').childNodes[0].innerText
                let companyUrlValue =  companyInfoDiv.querySelector('ul').childNodes[1].innerText
                let companyLocationValue = companyInfoDiv.querySelector('ul').childNodes[2].innerText
                let companyDateValue = companyInfoDiv.querySelector('ul').childNodes[3].innerText
                let companyStatusValue = companyInfoDiv.querySelector('ul').childNodes[4].innerText

                let updatedCompanyObject = {
                    name: companyNameValue,
                    url: companyUrlValue,
                    location: companyLocationValue,
                    date_applied: companyDateValue,
                    status: companyStatusValue
                }

                companyCards.adapterCompanies.updateCompany(updatedCompanyObject, companyId).then(company => {
                    editInfo.contentEditable = false
                    companyAnchor.href = companyUrlValue
                    companyAnchor.innerHTML = companyNameValue
                })
            }
        })
    }

    updateCompanyStatus(e) {
        let companyId = e.target.id.split('-')[2]
        let companyInfoDiv = document.querySelector(`#card-${companyId}`).childNodes[1]
        let companyStatusValue = companyInfoDiv.querySelector('ul').childNodes[4]
        let companyCard = document.querySelector(`#card-${companyId}`)
        let statusPick = e.target.innerHTML
        let responseButtons = companyCard.querySelectorAll(`.response-button`)

        let updateCompanyStatus = {
            status: statusPick
        }

        this.adapterCompanies.updateCompany(updateCompanyStatus, companyId).then(company => {
            if (statusPick === "Rejected") {
                companyStatusValue.innerHTML = 'Rejected'
                companyCard.style.backgroundColor = "#E74C3C"
            } else if (statusPick === "Accepted") {
                companyStatusValue.innerHTML = 'Accepted'
                companyCard.style.backgroundColor = "#239B56"
            }

            responseButtons.forEach(responseButton => responseButton.style.display = 'none')
        })
    }

    deleteCompany(e) {
        let companyId = e.target.parentNode.parentNode.id.split('-')[1]
        let companyCard = document.querySelector(`#card-${companyId}`)

        // Delete company comments.
        let companyComments = companyCard.querySelectorAll('.company-comments li')
        companyComments.forEach(companyComment => {
            let commentId = companyComment.id.split('-')[1]
            this.adapterComments.deleteComment(commentId)
        })

        // Communicate with the database.
        this.adapterCompanies.deleteCompany(companyId).then(companyObject => {
            companyCard.remove()
        })
    }

    showContent(e) {
        let statisticsContainer = document.querySelector('.statistics')
        let cardsButton = document.querySelector('.cards-click')
        let statisticsButton = document.querySelector('.statistics-click')

        if (e.target.innerHTML === "View Statistics") {
            companyCardsContainer.style.display = 'none'
            statisticsContainer.style.display = null
            statisticsButton.style.display = 'none'
            cardsButton.style.display = null
            this.statistics()
        } else if (e.target.innerHTML === "View Cards") {
            companyCardsContainer.style.display = null
            statisticsContainer.style.display = "none"
            statisticsButton.style.display = null
            cardsButton.style.display = "none"
        }
    }

    statistics() {
        let acceptedCompanies = new Array
        let rejectedCompanies = new Array
        let awaitingCompanies = new Array
        let companyCards = document.querySelectorAll('.company-card')

        companyCards.forEach(companyCard => {
            let companyStatusValue = companyCard.querySelector('ul').childNodes[4].innerText
            let trData = document.createElement('tr')
            let tdAccepted = document.createElement('td')
            let tdRejected = document.createElement('td')
            let tdAwaiting = document.createElement('td')
            let tdTotal = document.createElement('td')
            let table = document.querySelector('.total table tbody')
            let tableData = document.querySelector('.total tr:nth-child(2)')

            switch (companyStatusValue) {
                case "Accepted":
                    acceptedCompanies.push(companyCard)
                    break;
                case "Rejected":
                    rejectedCompanies.push(companyCard)
                    break;
                case "Awaiting Response":
                    awaitingCompanies.push(companyCard)
                    break;
            }

            tdAccepted.innerHTML = acceptedCompanies.length
            tdRejected.innerHTML = rejectedCompanies.length
            tdAwaiting.innerHTML = awaitingCompanies.length
            tdTotal.innerHTML = acceptedCompanies.length + rejectedCompanies.length + awaitingCompanies.length

            trData.appendChild(tdAccepted)
            trData.appendChild(tdRejected)
            trData.appendChild(tdAwaiting)
            trData.appendChild(tdTotal)
    
            tableData != null ? tableData.remove():false
    
            table.appendChild(trData)
        })
    }

    filter() {
        let companyCards = document.querySelectorAll('.company-card')
        let statusPick = document.querySelector('#status-dropdown').value
        let datePick = document.querySelector('#date-dropdown').value
        let thisMonth = new Date().getMonth() + 1
        let lastMonth = new Date().getMonth() + 1 - 1

        companyCards.forEach(companyCard => {
            let companyStatus = companyCard.querySelector('.company-info ul li:nth-child(5)').innerHTML
            let companyDate = companyCard.querySelector(`.company-info ul li:nth-child(4)`).innerHTML
            let companyMonth = new Date(companyDate).getMonth() + 1

            companyCard.style.display = 'none'
            
            if (companyStatus === statusPick || statusPick === "All" || (datePick === "This Month" && companyMonth === thisMonth) || (datePick == "Last Month" && companyMonth === lastMonth) || datePick === "All") {
                companyCard.style.display = null
                document.querySelector('#status-dropdown').selectedIndex = null
                document.querySelector('#date-dropdown').selectedIndex = null
            }
        })
    }

    buttonComment(e) {
        let companyId = e.target.parentNode.parentNode.id.split('-')[1]
        let companyCard = document.querySelector(`#card-${companyId}`)
        let commentButton = document.querySelector(`#comment-${companyId}`)
        let commentForm = companyCard.querySelector('input')
        let commentSubmit = companyCard.querySelector('.submit-comment-button')
        let exitSubmit = companyCard.querySelector('.exit-comment-button')

        if (e.target.innerHTML === "Leave a Comment") {
            commentButton.style.display = 'none'
            commentForm.style.display = null
            commentSubmit.style.display = null
            exitSubmit.style.display = null
        } else {
            commentForm.style.display = 'none'
            commentSubmit.style.display = 'none'
            exitSubmit.style.display = 'none'
            commentButton.style.display = null
        }
    }

    createComment(e) {
        let companyId = e.target.parentNode.parentNode.id.split('-')[1]
        let companyCard = document.querySelector(`#card-${companyId}`)
        let commentValue = companyCard.querySelector(`input`).value
        let companyCards = document.querySelectorAll(`.company-card`)

        let commentObject = {
            content: commentValue,
            company_id: companyId
        }

        this.adapterComments.createComment(commentObject).then(comment => {
            companyCards.forEach(companyCard => { companyCard.remove() })
            this.fetchCompanies()
        })
    }

    deleteComment(e) {
        let commentId = e.target.id.split('-')[2]

        // Communicate with the database.
        this.adapterComments.deleteComment(commentId).then(comment => {
            let commentLi = document.querySelector(`#comment-${commentId}`)
            commentLi.remove()
        })
    }
}