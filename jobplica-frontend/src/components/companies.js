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

            let companyUrlLi = document.createElement('li')
            companyUrlLi.style.display = "none"
            ulCompanyInfo.appendChild(companyUrlLi).innerHTML = company.url

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
            acceptButton.addEventListener('click', this.responseResponse.bind(this))
            updateCompanyDiv.appendChild(acceptButton)

            let rejectButton = document.createElement("button");
            rejectButton.innerHTML = "Rejected"
            rejectButton.setAttribute('id', 'reject-company-' + company.id)
            rejectButton.className = 'response-button'
            rejectButton.addEventListener('click', this.rejectedResponse.bind(this))
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
        e.preventDefault() // This prevents the default behavior. Anytime you submit a form, the default behavior is to refresh the page.

        const companyObject = {
            name: this.newCompanyName.value,
            location: this.newCompanyLocation.value,
            url: this.newCompanyUrl.value,
            date_applied: this.newCompanyDate.value,
        }

        this.adapterCompanies.createCompany(companyObject).then(company => {
            this.companies.push(new Company(company))

            let companyCards = document.querySelectorAll('.company-card')

            companyCards.forEach(companyCard => companyCard.remove())

            this.renderAll(this.companies);

            // Clear form values
            let newCompanyName = document.getElementById('new-company-name')
            let newCompanyLocation = document.getElementById('new-company-location')
            let newCompanyUrl = document.getElementById('new-company-url')
            let newCompanyDate = document.getElementById('new-company-date')

            newCompanyName.value = null
            newCompanyLocation.value = null
            newCompanyUrl.value = null
            newCompanyDate.value = null
        })
    }

    updateCompany(e) {
        let savedThis = this
        let selectedId = e.target.id.split('-')[1]
        let editContainer = document.querySelector(`#company-info-${selectedId}`)

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

                    // Company Object

                    let companyName = document.querySelector(`#container-${selectedId} a`).innerText
                    let companyUrl =  document.querySelector(`#container-${selectedId} ul li:nth-child(1)`).innerText
                    let companyLocation = document.querySelector(`#container-${selectedId} ul li:nth-child(2)`).innerText
                    let companyDate = document.querySelector(`#container-${selectedId} ul li:nth-child(3)`).innerText
                    let companyResponse = document.querySelector(`#container-${selectedId} ul li:nth-child(4)`).innerText

                    let newCompanyObject = {
                        name: companyName,
                        url: companyUrl,
                        location: companyLocation,
                        date_applied: companyDate,
                        status: companyResponse
                    }

                    // Comments Object

                    document.querySelector(`#container-${selectedId} a`).href = companyUrl
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

        let companyResponse = document.querySelector(`#container-${selectedId} ul li:nth-child(4)`).innerText

        let newCompanyObject = {
            status: "Rejected"
        }

        savedThis.adapter.rejectedStatusUpdate(newCompanyObject, selectedId)

        // Change company card's response to "Rejected"
        document.querySelector(`#container-${selectedId} ul li:nth-child(4)`).innerText = "Rejected"

        let companyCard = document.querySelector(`#container-${selectedId}`)
        companyCard.style.backgroundColor = "#E74C3C"

        // Buttons will disappear

        // let acceptButton = document.querySelector(`#approved-${selectedId}`)
        // let rejectButton = document.querySelector(`#rejected-${selectedId}`)

        // acceptButton.style.display = "none"
        // rejectButton.style.display = "none"
    }

    responseResponse(e) {
        e.preventDefault
        
        let savedThis = this
        let selectedId = e.target.id.split('-')[1]

        let companyResponse = document.querySelector(`#container-${selectedId} ul li:nth-child(4)`).innerText

        let newCompanyObject = {
            status: "Accepted"
        }

        savedThis.adapter.approvedStatusUpdate(newCompanyObject, selectedId)

        // Change company card's response to "Approved"
        document.querySelector(`#container-${selectedId} ul li:nth-child(4)`).innerText = "Accepted"

        let companyCard = document.querySelector(`#container-${selectedId}`)
        companyCard.style.backgroundColor = "#239B56"

        
        // Buttons will disappear

        // let acceptButton = document.querySelector(`#approved-${selectedId}`)
        // let rejectButton = document.querySelector(`#rejected-${selectedId}`)

        // acceptButton.style.display = "none"
        // rejectButton.style.display = "none"
    }

    filterStatus() {
        let companies = this.companies
    
        document.querySelector('#status-dropdown').addEventListener('change', function(e) {
            
            let statusPick = document.querySelector('#status-dropdown').value
            let companyCards = document.querySelectorAll('.company-card')
            
            for (let companyCard of companyCards) {
                companyCard.style.display = "none"

                let companyId = companyCard.id.split('-')[1]
                let companyResponse = companyCard.querySelector(`ul li:nth-child(4)`).innerText

                if (companyResponse == statusPick) {
                    companyCard.style.display = null
                    companyCard.style.visibility = "visible"
                    document.querySelector('#status-dropdown').selectedIndex = null
                } else if (statusPick == "All") {
                    for (let companyCard of companyCards) {
                        companyCard.style.display = null
                        companyCard.style.visibility = "visible"
                        document.querySelector('#status-dropdown').selectedIndex = null
                    }
                }
             }
        })
    }

    filterDate() {
        let companies = this.companies
        let companyCards = document.querySelectorAll('.company-card')
    
        document.querySelector('#date-dropdown').addEventListener('change', function(e) {

            for (let companyCard of companyCards) {
                companyCard.style.display = "none"
            }

            let today = new Date();
            let thisMonth = today.getMonth() + 1 // 8
            let lastMonth = today.getMonth() - 1 // 7
            let datePick = document.querySelector('#date-dropdown').value

            for (let companyCard of companyCards) {
                let companyId = companyCard.id.split('-')[1]
                let companyDate = companyCard.querySelector(`ul li:nth-child(3)`).innerText // Fri Aug 07 2020
                let companyNewDate = new Date(companyDate) // Fri Aug 07 2020 00:00:00 GMT-0700 (Pacific Daylight Time)
                let companyNewMonth = companyNewDate.getMonth() + 1 // 8

                if (datePick == "This Month") {
                    if (companyNewMonth == thisMonth) {
                        companyCard.style.display = null
                        companyCard.visibility = "visible"
                        document.querySelector('#date-dropdown').selectedIndex = null
                    }
                } else if (datePick == "Last Month") {
                    if (companyNewMonth == lastMonth) {
                        companyCard.style.display = null
                        companyCard.visibility = "visible"
                        document.querySelector('#date-dropdown').selectedIndex = null
                    }
                } else if (datePick == "All") {
                        companyCard.style.display = null
                        companyCard.visibility = "visible"
                        document.querySelector('#date-dropdown').selectedIndex = null
                }
            }
        })
    }

    bindStatistics() {
        let companies = this

        let companyCards = document.querySelector('.company')
        let statisticsContainer = document.querySelector('.statistics')
        let statisticsButton = document.querySelector('.statistics-click')
        let cardsButton = document.querySelector('.cards-click')

        statisticsContainer.style.display = "none"
        cardsButton.style.display = "none"

        statisticsButton.addEventListener('click', function(e) {
            companyCards.style.display = "none"
            statisticsContainer.style.display = null
            statisticsButton.style.display = "none"
            cardsButton.style.display = null

            companies.statistics()
        })
    }

    bindCards() {

        let companyCards = document.querySelector('.company')
        let statisticsContainer = document.querySelector('.statistics')
        let statisticsButton = document.querySelector('.statistics-click')
        let cardsButton = document.querySelector('.cards-click')

        cardsButton.addEventListener('click', function(e) {
            companyCards.style.display = null
            statisticsContainer.style.display = "none"
            statisticsButton.style.display = null
            cardsButton.style.display = "none"
        })
    }

    statistics() {
        let acceptedArray = []
        let rejectedArray = []
        let awaitingArray = []

        this.adapter.getCompanies()
        .then(companies => {
            companies.forEach(company => {
                if (company.status == "Accepted") {
                    acceptedArray.push(company)
                } else if (company.status == "Rejected") {
                    rejectedArray.push(company)
                } else {
                    awaitingArray.push(company)
                }
            })
        })

        let tr = document.querySelector('#total-input')

        let tdAccepted = document.createElement('td')
        tdAccepted.innerHTML = acceptedArray.length
        tr.appendChild(tdAccepted)

        let tdRejected = document.createElement('td')
        tdRejected.innerHTML = rejectedArray.length
        tr.appendChild(tdRejected)

        let tdAwaiting = document.createElement('td')
        tdAwaiting.innerHTML = awaitingArray.length
        tr.appendChild(tdAwaiting)

        let tdTotal = document.createElement('td')
        tdTotal.innerHTML = acceptedArray.length + rejectedArray.length + awaitingArray.length
        tr.appendChild(tdTotal)
    }

    leaveComment(e) {
        let selectedId = e.target.id.split('-')[1]
        let companies = this

        let form = document.createElement('input')
        let companyCard = document.querySelector(`#container-${selectedId}`)
        let commentSubmit = document.createElement('input')
        commentSubmit.setAttribute('type', 'submit')

                
        // Leave comment button disappears
        let commentButton = document.querySelector(`button#comment-${selectedId}`)
        companyCard.removeChild(commentButton)
        //

        let exitSubmit = document.createElement('input')
        exitSubmit.setAttribute('type', 'submit')
        exitSubmit.value = "Exit"

        companyCard.appendChild(form)
        companyCard.appendChild(commentSubmit)
        companyCard.appendChild(exitSubmit)

        exitSubmit.addEventListener('click', function() {
            companyCard.removeChild(form)
            companyCard.removeChild(commentSubmit)
            companyCard.removeChild(exitSubmit)
            companyCard.appendChild(commentButton)

        })

        commentSubmit.addEventListener('click', function() {            
            let commentValue = document.querySelector(`#container-${selectedId} input`).value

            let commentObject = {
                content: commentValue,
                company_id: selectedId
            }

            //Good up to this point. Now I have to CREATE the comment (link it to the database)

            companies.adapterComments.createComment(commentObject).then(comment => {

                let ulComment = companyCard.querySelector(`ul.comments`)
                let li = document.createElement('li')
                li.setAttribute('id', 'comment-' + comment.id)
                li.innerHTML = commentValue
    
                let deleteButton = document.createElement('button')
                deleteButton.setAttribute('id', comment.id)
                deleteButton.innerHTML = "Delete"
                deleteButton.className = 'delete-comment-button'
                li.appendChild(deleteButton)
                deleteButton.addEventListener('click', companies.deleteComment.bind(companies))
                
                ulComment.appendChild(li)
    
    
                // The input disappears.
                companyCard.removeChild(form)
                companyCard.removeChild(commentSubmit)
                companyCard.removeChild(exitSubmit)
                companyCard.appendChild(commentButton)
            })

            // Up until this point, comments are created into the database. Next step:
            // Upon comment submission, append comment to company-card.

        })
    }

    deleteComment(e) {
        console.log(e.target)
        console.log(this)

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