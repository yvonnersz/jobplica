const companyCardsContainer = document.querySelector('.company-cards')
const statisticsContainer = document.querySelector('.statistics')
const cardsButton = document.querySelector('.cards-click')
const statisticsButton = document.querySelector('.statistics-click')
const filterByStatus = document.querySelector('#status-dropdown')
const filterByDate = document.querySelector('#date-dropdown')
const companyForm = document.getElementById('new-company')


class Companies {
    constructor() {
        this.adapterCompanies = new CompaniesAdapter()
        this.adapterComments = new CommentsAdapter()
        this.fetchCompanies()
        this.bindEventListeners()
    }

    bindEventListeners() {
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

            // Create company comments.

            let divComments = document.createElement('div')
            let ulComments = document.createElement('ul')

            company.comments.forEach(comment => {
                let commentLi = document.createElement('li')
                let deleteButton = document.createElement('button')

                commentLi.setAttribute('id', 'comment-' + comment.id)
                deleteButton.className = 'delete-comment-button'

                deleteButton.addEventListener('click', this.deleteComment.bind(this))

                ulComments.appendChild(commentLi).innerHTML = comment.content
                commentLi.appendChild(deleteButton).innerHTML = 'x'
            })

            divComments.className = 'company-comments'

            divComments.appendChild(ulComments)
            cardDiv.appendChild(divComments)

            // Create status update and leave comment buttons.

            let updateCompanyDiv = document.createElement('div')
            let acceptButton = document.createElement("button");
            let rejectButton = document.createElement("button");
            let commentButton = document.createElement('button')
            let commentForm = document.createElement('input')
            let commentSubmitButton = document.createElement('input')
            let exitSubmit = document.createElement('input')

            updateCompanyDiv.className = 'company-update'
            acceptButton.className = 'response-button'
            rejectButton.className = 'response-button'
            commentButton.className = 'comment-button'
            commentForm.style.display = 'none'
            commentSubmitButton.setAttribute('type', 'submit')
            commentSubmitButton.className = 'submit-comment-button'
            commentSubmitButton.style.display = 'none'
            exitSubmit.className = 'exit-comment-button'
            exitSubmit.setAttribute('type', 'submit')
            exitSubmit.style.display = 'none'

            acceptButton.addEventListener('click', this.updateCompanyStatus.bind(this))
            rejectButton.addEventListener('click', this.updateCompanyStatus.bind(this))
            commentButton.addEventListener('click', this.buttonComment.bind(this))
            commentSubmitButton.addEventListener('click', this.createComment.bind(this))
            exitSubmit.addEventListener('click', this.buttonComment.bind(this))

            updateCompanyDiv.appendChild(acceptButton).innerHTML = "Accepted"
            updateCompanyDiv.appendChild(rejectButton).innerHTML = "Rejected"
            updateCompanyDiv.appendChild(commentButton).innerHTML = "Leave a Comment"
            updateCompanyDiv.appendChild(commentForm)
            updateCompanyDiv.appendChild(commentSubmitButton)
            updateCompanyDiv.appendChild(exitSubmit).value = "Exit"
            cardDiv.appendChild(updateCompanyDiv)
            companyCardsContainer.appendChild(cardDiv)

            // Changes background color depending on company status.

            if (company.status == "Accepted" || company.status == "Rejected") {
                rejectButton.style.display = "none"
                acceptButton.style.display = "none"

                company.status === "Accepted" ? cardDiv.style.backgroundColor = "#239B56":false
                company.status === "Rejected" ? cardDiv.style.backgroundColor = "#E74C3C":false
            }
        }
    }

    createCompany(e) {
        // After submitting a form, the default behavior is to refresh the page. The following line prevents that.
        e.preventDefault();

        let newCompanyName = document.getElementById('new-company-name').value
        let newCompanyLocation = document.getElementById('new-company-location').value
        let newCompanyUrl = document.getElementById('new-company-url').value
        let newCompanyDate = document.getElementById('new-company-date').value

        const newCompany = {
            name: newCompanyName,
            location: newCompanyLocation,
            url: newCompanyUrl,
            date_applied: newCompanyDate,
        }

        this.adapterCompanies.createCompany(newCompany).then(company => {
            this.render(new Array(company));
            
            newCompanyName = null
            newCompanyLocation = null
            newCompanyUrl = null
            newCompanyDate = null
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
        let companyId = e.target.parentNode.parentNode.id.split('-')[1]
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
        const companyCards = document.querySelectorAll('.company-card')
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
        const commentButton = companyCard.querySelector(`.comment-button`)
        const commentForm = companyCard.querySelector('input')
        const commentSubmit = companyCard.querySelector('.submit-comment-button')
        const commentExit = companyCard.querySelector('.exit-comment-button')

        if (e.target.innerHTML === "Leave a Comment") {
            commentButton.style.display = 'none'
            commentForm.style.display = null
            commentSubmit.style.display = null
            commentExit.style.display = null
        } else {
            commentButton.style.display = null
            commentForm.style.display = 'none'
            commentSubmit.style.display = 'none'
            commentExit.style.display = 'none'
        }
    }

    createComment(e) {
        let companyId = e.target.parentNode.parentNode.id.split('-')[1]
        const companyCards = document.querySelectorAll(`.company-card`)
        let companyCard = document.querySelector(`#card-${companyId}`)
        let commentValue = companyCard.querySelector(`input`).value

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
        let commentId = e.target.parentNode.id.split('-')[1]

        // Communicate with the database.
        this.adapterComments.deleteComment(commentId).then(comment => {
            let commentLi = document.querySelector(`#comment-${commentId}`)
            commentLi.remove()
        })
    }
}