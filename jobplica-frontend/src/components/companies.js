class Companies {
    constructor() {
        this.companies = []
        this.adapterCompanies = new CompaniesAdapter()
        this.adapterComments = new CommentsAdapter()
        this.fetchAndLoadCompanies()
        this.bindingAndEventListener()
        this.bindStatistics()
        this.bindCards()
        this.filterStatus()
        this.filterDate()
    }

    fetchAndLoadCompanies() {
        this.adapterCompanies.getCompanies()
            .then(companies => { 
                companies.forEach(company => this.companies.push(new Company(company)))
            }).then (() => {
                this.renderAll()
            })
    }

    renderAll() {
        let companiesContainer = document.querySelector('.company-cards')

        for (const company of this.companies) {

            // Create company card div.

            let cardDiv = document.createElement('div')
            cardDiv.setAttribute('id', 'card-' + company.id)
            cardDiv.className = "company-card"

            // Create edit buttons for company card.

            let editCardDiv = document.createElement('div')
            editCardDiv.className = 'company-edit'

            let editButton = document.createElement('button')
            editButton.className = "edit-company-button"
            editButton.setAttribute('id', 'edit-company-' + company.id)
            editButton.innerHTML = '...'
            editButton.addEventListener('focus', this.updateCompany.bind(this))
            editCardDiv.appendChild(editButton)

            let deleteButton = document.createElement('button')
            deleteButton.className = "delete-company-button"
            deleteButton.setAttribute('id', 'delete-company-' + company.id)
            deleteButton.innerHTML = "Delete"
            deleteButton.style.display = "none"
            editCardDiv.appendChild(deleteButton)

            cardDiv.appendChild(editCardDiv)

            // Appending company info to card.

            let companyInfoDiv = document.createElement('div')
            companyInfoDiv.className = "company-info"

            let companyLink = document.createElement('a')
            companyLink.text = company.name
            companyLink.href = company.url
            companyInfoDiv.appendChild(companyLink)

            let ulCompanyInfo = document.createElement('ul')

            let nameLi = document.createElement('li')
            nameLi.style.display = 'none'
            ulCompanyInfo.appendChild(nameLi).innerHTML = company.name

            let urlLi = document.createElement('li')
            urlLi.style.display = "none"
            ulCompanyInfo.appendChild(urlLi).innerHTML = company.url

            let locationLi = document.createElement('li')
            ulCompanyInfo.appendChild(locationLi).innerHTML = company.location

            let dateLi = document.createElement('li')
            ulCompanyInfo.appendChild(dateLi).innerHTML = company.renderDate()

            let statusLi = document.createElement('li')
            ulCompanyInfo.appendChild(statusLi).innerHTML = company.status

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
            acceptButton.addEventListener('click', this.acceptedStatusUpdate.bind(this))
            updateCompanyDiv.appendChild(acceptButton)

            let rejectButton = document.createElement("button");
            rejectButton.innerHTML = "Rejected"
            rejectButton.setAttribute('id', 'reject-company-' + company.id)
            rejectButton.className = 'response-button'
            rejectButton.addEventListener('click', this.rejectedStatusUpdate.bind(this))
            updateCompanyDiv.appendChild(rejectButton)

            let commentButton = document.createElement('button')
            commentButton.innerHTML = "Leave a Comment"
            commentButton.className = 'comment-button'
            commentButton.setAttribute('id', 'comment-' + company.id)
            commentButton.addEventListener('click', this.leaveComment.bind(this))
            updateCompanyDiv.appendChild(commentButton)

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

    bindingAndEventListener() {
        this.companyForm = document.getElementById('new-company')
        this.companyForm.addEventListener('submit', this.createCompany.bind(this))
        
        this.newCompanyName = document.getElementById('new-company-name')
        this.newCompanyLocation = document.getElementById('new-company-location')
        this.newCompanyUrl = document.getElementById('new-company-url')
        this.newCompanyDate = document.getElementById('new-company-date')
        this.newCompanyStatus = document.getElementById('new-company-status')
    }

    createCompany(e) {
        // After submitting a form, the default behavior is to refresh the page. The following line prevents that.
        e.preventDefault()

        // Grabbing the inputted values from the form to create the new company object.
        const newCompanyObject = {
            name: this.newCompanyName.value,
            location: this.newCompanyLocation.value,
            url: this.newCompanyUrl.value,
            date_applied: this.newCompanyDate.value,
        }

        this.adapterCompanies.createCompany(newCompanyObject).then(company => {
            this.companies.push(new Company(company))

            // Clearing the old company cards and re-rendering the new cards.
            let companyCards = document.querySelectorAll('.company-card')
            companyCards.forEach(companyCard => companyCard.remove())

            this.renderAll(this.companies);

            // Clearing the form values.
            this.newCompanyName.value = null
            this.newCompanyLocation.value = null
            this.newCompanyUrl.value = null
            this.newCompanyDate.value = null
        })
    }

    updateCompany(e) {
        let companyCards = this
        let companyId = e.target.id.split('-')[2]

        // Hides the edit button and displays the delete button.

        let editButton = document.querySelector(`#edit-company-${companyId}`)
        editButton.style.display = "none"

        let deleteButton = document.querySelector(`#delete-company-${companyId}`)
        deleteButton.style.display = null
        deleteButton.style.visibility = "visible"
        deleteButton.addEventListener('click', this.deleteCompany.bind(this))

        // Hides anchor tag and displays the hidden company name and company url.

        let companyInfoDiv = document.querySelector(`#card-${companyId}`).childNodes[1]

        let companyAnchor = companyInfoDiv.querySelector('a')
        companyAnchor.style.display = 'none'

        let companyName = companyInfoDiv.querySelector('ul').childNodes[0]
        companyName.style.display = null
        companyName.style.visibility = "visible"
        companyName.style.overflow = 'hidden'

        let companyUrl = companyInfoDiv.querySelector('ul').childNodes[1]
        companyUrl.style.display = null
        companyUrl.style.visibility = "visible"
        companyUrl.style.overflow = 'hidden'

        // addEventListener to exit out of update.

        window.addEventListener('dblclick', function(e) {   
            if (companyInfoDiv.contains(e.target)) {
                
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

                        companyCards.adapterCompanies.updateCompany(updatedCompanyObject, companyId)
                        editInfo.contentEditable = false

                        // Updates the anchor link.
                        companyAnchor.href = companyUrlValue
                        companyAnchor.innerHTML = companyNameValue
                    }
                })
            } else {
                // Resets all the buttons to default card position.
                e.target.contentEditable = false
                editButton.style.display = null
                editButton.style.visibility = "visible"
                deleteButton.style.display = "none"
                companyAnchor.style.display = null
                companyAnchor.style.visibility = 'visible'
                companyName.style.display = 'none'
                companyUrl.style.display = "none"
            }
          })
    }

    deleteCompany(e) {
        let companyCards = this
        let companyId = e.target.id.split('-')[2]

        let companyInfoDiv = document.querySelector(`#card-${companyId}`).childNodes[1]
        let companyNameValue = companyInfoDiv.querySelector('ul').childNodes[0].innerText
        let companyUrlValue =  companyInfoDiv.querySelector('ul').childNodes[1].innerText
        let companyLocationValue = companyInfoDiv.querySelector('ul').childNodes[2].innerText
        let companyDateValue = companyInfoDiv.querySelector('ul').childNodes[3].innerText
        let companyStatusValue = companyInfoDiv.querySelector('ul').childNodes[4].innerText

        let companyObject = {
            name: companyNameValue,
            location: companyUrlValue,
            url: companyLocationValue,
            date_applied: companyDateValue,
            status: companyStatusValue
        }

        companyCards.adapterCompanies.deleteCompany(companyObject, companyId)

        let companyCard = document.querySelector(`#card-${companyId}`)
        companyCard.remove()
    }

    rejectedStatusUpdate(e) {        
        let companyCards = this
        let companyId = e.target.id.split('-')[2]

        let updateCompanyStatus = {
            status: "Rejected"
        }

        companyCards.adapterCompanies.rejectedStatusUpdate(updateCompanyStatus, companyId)

        // Update company card status to 'Rejected' with associated CSS.

        let companyInfoDiv = document.querySelector(`#card-${companyId}`).childNodes[1]
        let companyStatusValue = companyInfoDiv.querySelector('ul').childNodes[4]
        companyStatusValue.innerHTML = 'Rejected'

        let companyCard = document.querySelector(`#card-${companyId}`)
        companyCard.style.backgroundColor = "#E74C3C"

        // Buttons will disappear

        // let acceptButton = document.querySelector(`#approved-${selectedId}`)
        // let rejectButton = document.querySelector(`#rejected-${selectedId}`)

        // acceptButton.style.display = "none"
        // rejectButton.style.display = "none"
    }

    acceptedStatusUpdate(e) {        
        let companyCards = this
        let companyId = e.target.id.split('-')[2]

        let updateCompanyStatus = {
            status: "Accepted"
        }

        companyCards.adapterCompanies.acceptedStatusUpdate(updateCompanyStatus, companyId)

        // Change company card's response to "Accepted"

        let companyInfoDiv = document.querySelector(`#card-${companyId}`).childNodes[1]
        let companyStatusValue = companyInfoDiv.querySelector('ul').childNodes[4]
        companyStatusValue.innerHTML = 'Accepted'

        let companyCard = document.querySelector(`#card-${companyId}`)
        companyCard.style.backgroundColor = "#239B56"

        
        // Buttons will disappear

        // let acceptButton = document.querySelector(`#approved-${selectedId}`)
        // let rejectButton = document.querySelector(`#rejected-${selectedId}`)

        // acceptButton.style.display = "none"
        // rejectButton.style.display = "none"
    }

    filterStatus() { // This should just be binded to Event Listener    
        document.querySelector('#status-dropdown').addEventListener('change', function(e) {

            let statusPick = document.querySelector('#status-dropdown').value
            let companyCards = document.querySelectorAll('.company-card')
            
            for (let companyCard of companyCards) {
                companyCard.style.display = "none"

                let companyId = companyCard.id.split('-')[1]
                let companyInfoDiv = document.querySelector(`#card-${companyId}`).childNodes[1]
                let companyStatusValue = companyInfoDiv.querySelector('ul').childNodes[4].innerHTML

                if (companyStatusValue === statusPick) {
                    companyCard.style.display = null
                    companyCard.style.visibility = "visible"
                    document.querySelector('#status-dropdown').selectedIndex = null
                } else if (statusPick === "All") {
                    for (let companyCard of companyCards) {
                        companyCard.style.display = null
                        companyCard.style.visibility = "visible"
                        document.querySelector('#status-dropdown').selectedIndex = null
                    }
                }
             }
        })
    }

    filterDate() { // This should be binded to EventListener    
        document.querySelector('#date-dropdown').addEventListener('change', function(e) {

            let companyCards = document.querySelectorAll('.company-card')
            let datePick = document.querySelector('#date-dropdown').value

            for (let companyCard of companyCards) {
                companyCard.style.display = "none"
            }

            let today = new Date();
            let thisMonth = today.getMonth() + 1 // 8
            let lastMonth = today.getMonth() - 1 // 7

            for (let companyCard of companyCards) {
                let companyId = companyCard.id.split('-')[1]
                let companyInfoDiv = document.querySelector(`#card-${companyId}`).childNodes[1]
                let companyDateValue = companyInfoDiv.querySelector('ul').childNodes[3].innerHTML
                let companyNewDate = new Date(companyDateValue) // Fri Aug 07 2020 00:00:00 GMT-0700 (Pacific Daylight Time)
                let companyNewMonth = companyNewDate.getMonth() + 1 // 8

                if (datePick === "This Month") {
                    if (companyNewMonth === thisMonth) {
                        companyCard.style.display = null
                        companyCard.visibility = "visible"
                        document.querySelector('#date-dropdown').selectedIndex = null
                    }
                } else if (datePick == "Last Month") {
                    if (companyNewMonth === lastMonth) {
                        companyCard.style.display = null
                        companyCard.visibility = "visible"
                        document.querySelector('#date-dropdown').selectedIndex = null
                    }
                } else if (datePick === "All") {
                        companyCard.style.display = null
                        companyCard.visibility = "visible"
                        document.querySelector('#date-dropdown').selectedIndex = null
                }
            }
        })
    }

    bindStatistics() {
        let companies = this

        let statisticsContainer = document.querySelector('.statistics')
        statisticsContainer.style.display = 'none'

        let cardsButton = document.querySelector('.cards-click')
        cardsButton.style.display = 'none'

        let statisticsButton = document.querySelector('.statistics-click')

        statisticsButton.addEventListener('click', function(e) {
            let companyCardsContainer = document.querySelector('.company-cards')

            companyCardsContainer.style.display = 'none'
            statisticsContainer.style.display = null
            statisticsButton.style.display = 'none'
            cardsButton.style.display = null

            companies.statistics()
        })
    }

    bindCards() {
        let companyCardsContainer = document.querySelector('.company-cards')
        let statisticsContainer = document.querySelector('.statistics')
        let statisticsButton = document.querySelector('.statistics-click')
        let cardsButton = document.querySelector('.cards-click')

        cardsButton.addEventListener('click', function(e) {
            companyCardsContainer.style.display = null
            statisticsContainer.style.display = "none"
            statisticsButton.style.display = null
            cardsButton.style.display = "none"
        })
    }

    statistics() {
        let acceptedArray = []
        let rejectedArray = []
        let awaitingArray = []

        this.adapterCompanies.getCompanies()
        .then(companies => {
            companies.forEach(company => {

                if (company.status === "Accepted") {
                    acceptedArray.push(company)
                } else if (company.status === "Rejected") {
                    rejectedArray.push(company)
                } else {
                    awaitingArray.push(company)
                }

                let trData = document.createElement('tr')

                let tdAccepted = document.createElement('td')
                tdAccepted.innerHTML = acceptedArray.length
                trData.appendChild(tdAccepted)
        
                let tdRejected = document.createElement('td')
                tdRejected.innerHTML = rejectedArray.length
                trData.appendChild(tdRejected)
        
                let tdAwaiting = document.createElement('td')
                tdAwaiting.innerHTML = awaitingArray.length
                trData.appendChild(tdAwaiting)
        
                let tdTotal = document.createElement('td')
                tdTotal.innerHTML = acceptedArray.length + rejectedArray.length + awaitingArray.length
                trData.appendChild(tdTotal)
        
                let table = document.querySelector('.total table tbody')
                let tableData = document.querySelector('.total tr:nth-child(2)')
        
                tableData != null ? tableData.remove():false
        
                table.appendChild(trData)
            })
        })
    }

    leaveComment(e) {
        let companyCards = this
        let companyId = e.target.id.split('-')[1]

        let form = document.createElement('input')
        let companyCard = document.querySelector(`#card-${companyId}`)
        let commentSubmit = document.createElement('input')
        commentSubmit.setAttribute('type', 'submit')

        // Leave comment button disappears.
        let commentButton = document.querySelector(`#comment-${companyId}`)
        commentButton.style.display = 'none'

        let exitSubmit = document.createElement('input')
        exitSubmit.setAttribute('type', 'submit')
        exitSubmit.value = "Exit"

        companyCard.appendChild(form)
        companyCard.appendChild(commentSubmit)
        companyCard.appendChild(exitSubmit)

        // If user hits exit, default buttons will display.
        exitSubmit.addEventListener('click', function() {
            companyCard.removeChild(form)
            companyCard.removeChild(commentSubmit)
            companyCard.removeChild(exitSubmit)
            commentButton.style.display = null
        })

        commentSubmit.addEventListener('click', function() {            
            let commentValue = document.querySelector(`#card-${companyId} input`).value

            let commentObject = {
                content: commentValue,
                company_id: companyId
            }

            companyCards.adapterComments.createComment(commentObject).then(comment => {

                let ulComment = companyCard.querySelector(`.company-comments ul`)
                let liComment = document.createElement('li')
                liComment.setAttribute('id', 'comment-' + comment.id)
                liComment.innerHTML = commentValue
    
                let deleteButton = document.createElement('button')
                deleteButton.setAttribute('id', 'delete-' + comment.id)
                deleteButton.innerHTML = "x"
                deleteButton.className = 'delete-comment-button'
                liComment.appendChild(deleteButton)
                deleteButton.addEventListener('click', companyCards.deleteComment.bind(companyCards))
                
                ulComment.appendChild(liComment)

                // The input disappears.
                companyCard.removeChild(form)
                companyCard.removeChild(commentSubmit)
                companyCard.removeChild(exitSubmit)
                commentButton.style.display = null
            })
        })
    }

    deleteComment(e) {

        let commentId = e.target.id
        let companies = this

        let commentValue = document.querySelector(`.comments #comment-${commentId}`).innerText.split('D')[0]

        let commentObject = {
            content: commentValue,
            company_id: commentId
        }

        companies.adapterComments.deleteComment(commentObject, commentId)

        // Remove comment from DOM
        
        let commentLi = document.querySelector(`#comment-${commentId}`)

        commentLi.parentNode.removeChild(commentLi)
    }
}