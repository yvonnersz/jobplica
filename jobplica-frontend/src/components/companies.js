const statisticsButton = document.querySelector('.statistics-click')
const cardsButton = document.querySelector('.cards-click')
const filterByStatus = document.querySelector('#status-dropdown')
const filterByDate = document.querySelector('#date-dropdown')
const companyForm = document.getElementById('new-company')
const companyCardsContainer = document.querySelector('.company-cards')
const statisticsContainer = document.querySelector('.statistics')

class Companies {
    constructor() {
        this.adapterCompanies = new CompaniesAdapter()
        this.adapterComments = new CommentsAdapter()
        this.bindEventListeners()
        this.fetchCompanies()
    }

    bindEventListeners() {
        statisticsButton.addEventListener('click', this.showContent.bind(this))
        cardsButton.addEventListener('click', this.showContent.bind(this))
        filterByStatus.addEventListener('change', this.filter.bind(this))
        filterByDate.addEventListener('change', this.filter.bind(this))
        companyForm.addEventListener('submit', this.createCompany.bind(this))

        cardsButton.style.display = 'none'
        statisticsContainer.style.display = 'none'
    }

    fetchCompanies() {
        this.adapterCompanies.getCompanies().then(companies => { 
            // let sortedCompanies = companies.sort()
            let sortedCompanies = companies.sort(function (a, b) {
                if (a.name < b.name) {
                    return -1;
                } else if (a.name > b.name) {
                    return 1;
                } else {
                    return 0;
                }
            })

            this.render(sortedCompanies)
        })
    }

    render(companies) {        
        for (const company of companies) {

            // Create company card div.

            const cardDiv = document.createElement('div')
                cardDiv.className = "company-card"
                cardDiv.setAttribute('id', 'card-' + company.id)

            // Create edit and delete buttons for company card.

            const editButtonsDiv = document.createElement('div')
                editButtonsDiv.className = 'company-edit'

            const editButton = document.createElement('button')
                editButton.className = "edit-company-button"
                editButton.innerHTML = '...'
                editButton.addEventListener('focus', this.buttonEditCompany.bind(this))

            const deleteButton = document.createElement('button')   
                deleteButton.className = "delete-company-button"
                deleteButton.innerHTML = "Delete"
                deleteButton.style.display = 'none'
                deleteButton.addEventListener('click', this.deleteCompany.bind(this))

            editButtonsDiv.appendChild(editButton)
            editButtonsDiv.appendChild(deleteButton)
            cardDiv.appendChild(editButtonsDiv)

            // Create company info elements such as: name, url, location, date, and status.

            const companyInfoDiv = document.createElement('div')
                companyInfoDiv.className = 'company-info'

            const companyHead = document.createElement('a')
                companyHead.href = company.url
                companyHead.innerHTML = company.name

            const ulCompanyInfo = document.createElement('ul')

                const liName = document.createElement('li')
                    liName.style.display = 'none'
                    liName.innerHTML = company.name

                const liUrl = document.createElement('li')
                    liUrl.style.display = 'none'
                    liUrl.innerHTML = company.url

                const liLocation = document.createElement('li')
                    liLocation.innerHTML = company.location

                const liDate = document.createElement('li')
                    liDate.innerHTML = new Company(company).renderDate

                const liStatus = document.createElement('li')
                    liStatus.innerHTML = company.status

            ulCompanyInfo.appendChild(liName)
            ulCompanyInfo.appendChild(liUrl)
            ulCompanyInfo.appendChild(liLocation)
            ulCompanyInfo.appendChild(liDate)
            ulCompanyInfo.appendChild(liStatus)
            companyInfoDiv.appendChild(companyHead)
            companyInfoDiv.appendChild(ulCompanyInfo)
            cardDiv.appendChild(companyInfoDiv)

            // Create company comments.

            const divComments = document.createElement('div')
                divComments.className = 'company-comments'

            const ulComments = document.createElement('ul')

                company.comments.forEach(comment => {
                    const commentLi = document.createElement('li')
                        commentLi.setAttribute('id', 'comment-' + comment.id)
                        commentLi.innerHTML = comment.content
                    const deleteButton = document.createElement('button')
                        deleteButton.className = 'delete-comment-button'
                        deleteButton.addEventListener('click', this.deleteComment.bind(this))

                    ulComments.appendChild(commentLi)
                    company.status === "Awaiting Response" ? commentLi.appendChild(deleteButton).innerHTML = 'X':false
                })

            divComments.appendChild(ulComments)
            cardDiv.appendChild(divComments)

            // Create status update and leave comment buttons.

            const updateCompanyDiv = document.createElement('div')
                updateCompanyDiv.className = 'company-update'

            const acceptButton = document.createElement("button");
                acceptButton.className = 'response-button'
                acceptButton.innerHTML = 'Accepted'
                acceptButton.addEventListener('click', this.updateCompanyStatus.bind(this))

            const rejectButton = document.createElement("button");
                rejectButton.className = 'response-button'
                rejectButton.innerHTML = 'Rejected'
                rejectButton.addEventListener('click', this.updateCompanyStatus.bind(this))

            const awaitButton = document.createElement("button");
                awaitButton.className = 'await-button'
                awaitButton.style.display = 'none'
                awaitButton.innerHTML = 'Awaiting Response'
                awaitButton.addEventListener('click', this.updateCompanyStatus.bind(this))

            const commentButton = document.createElement('button')
                commentButton.className = 'comment-button'
                commentButton.innerHTML = 'Leave a Comment'
                commentButton.addEventListener('click', this.buttonComment.bind(this))

            const commentForm = document.createElement('input')
                commentForm.className = 'comment-form'
                commentForm.style.display = 'none'

            const commentSubmitButton = document.createElement('input')
                commentSubmitButton.setAttribute('type', 'submit')
                commentSubmitButton.className = 'submit-comment-button'
                commentSubmitButton.style.display = 'none'
                commentSubmitButton.addEventListener('click', this.createComment.bind(this))

            const exitSubmit = document.createElement('input')
                exitSubmit.className = 'exit-comment-button'
                exitSubmit.setAttribute('type', 'submit')
                exitSubmit.style.display = 'none'
                exitSubmit.value = 'Exit'
                exitSubmit.addEventListener('click', this.buttonComment.bind(this))

            updateCompanyDiv.appendChild(acceptButton)
            updateCompanyDiv.appendChild(rejectButton)
            updateCompanyDiv.appendChild(awaitButton)
            updateCompanyDiv.appendChild(commentButton)
            updateCompanyDiv.appendChild(commentForm)
            updateCompanyDiv.appendChild(commentSubmitButton)
            updateCompanyDiv.appendChild(exitSubmit)
            cardDiv.appendChild(updateCompanyDiv)
            companyCardsContainer.appendChild(cardDiv)

            // Changes background color depending on company status.
            if (company.status == "Accepted" || company.status == "Rejected") {
                rejectButton.style.display = 'none'
                acceptButton.style.display = 'none'
                commentButton.style.display = 'none'
                cardDiv.style.opacity = 0.50;

                company.status === "Accepted" ? cardDiv.style.backgroundColor = "#9EB371":false
                company.status === "Rejected" ? cardDiv.style.backgroundColor = "#E17878":false
            }
        }
    }

    createCompany(e) {
        e.preventDefault();

        const newCompanyName = document.getElementById('new-company-name').value
        const newCompanyLocation = document.getElementById('new-company-location').value
        const newCompanyUrl = document.getElementById('new-company-url').value
        const newCompanyDate = document.getElementById('new-company-date').value

        const newCompany = {
            name: newCompanyName,
            location: newCompanyLocation,
            url: newCompanyUrl,
            date_applied: newCompanyDate,
        }

        this.adapterCompanies.createCompany(newCompany).then(company => {
            this.render(new Array(company));
            companyForm.reset();
        })
    }

    buttonEditCompany(e) {
        const companyCards = this
        let companyId = e.target.parentNode.parentNode.id.split('-')[1]
        let companyCard = document.querySelector(`#card-${companyId}`)
        let editButton = companyCard.querySelector(`.edit-company-button`)
        let deleteButton = companyCard.querySelector(`.delete-company-button`)
        let companyInfoDiv = companyCard.querySelector(`.company-info`)
        let companyAnchor = companyCard.querySelector('a')
        let companyName = companyCard.querySelector('ul li:nth-child(1)')
        let companyUrl = companyCard.querySelector('ul li:nth-child(2)')
        let companyDate = companyCard.querySelector('ul li:nth-child(4)')
        let companyStatus = companyCard.querySelector('ul li:nth-child(5)')
        let companyStatusButtons = companyCard.querySelectorAll('.response-button')
        let companyAwaitButton = companyCard.querySelector(`.await-button`)
        let companyComments = companyCard.querySelectorAll('.company-comments ul li')
        let commentButton = companyCard.querySelector('.comment-button')
        let commentInputs = companyCard.querySelectorAll('input')

        editButton.style.display = 'none'
        deleteButton.style.display = null
        companyAnchor.style.display = 'none'
        companyName.style.display = null
        companyUrl.style.display = null
        companyStatus.style.display = 'none'
        companyDate.style.display = 'none'
        companyComments.forEach(companyComment => companyComment.style.display = 'none')
        companyStatusButtons.forEach(companyStatusButton => companyStatusButton.style.display = null)
        companyAwaitButton.style.display = null
        commentButton.style.display = 'none'
        commentInputs.forEach(commentInput => commentInput.style.display = 'none')

        // The code below does the following:
        // User will be able to edit content if content is double-clicked within card.
        // Else the edit buttons will default to default card position.

        window.addEventListener('dblclick', function(e) {   
            if (companyInfoDiv.contains(e.target)) {
                companyCards.updateCompany(e)
            } else {
              e.target.contentEditable = false
              editButton.style.display = null
              deleteButton.style.display = 'none'
              companyAnchor.style.display = null
              companyName.style.display = 'none'
              companyUrl.style.display = 'none'
              companyStatus.style.display = null
              companyDate.style.display = null
              companyComments.forEach(companyComment => companyComment.style.display = null)
              companyAwaitButton.style.display = 'none'

              if (companyStatus.innerHTML === "Awaiting Response") {
                companyStatusButtons.forEach(companyStatusButton => companyStatusButton.style.display = null)
                commentButton.style.display = null
              } else {
                companyStatusButtons.forEach(companyStatusButton => companyStatusButton.style.display = 'none')
                commentButton.style.display = 'none'
              }
            }
        })
    }

    updateCompany(e) {
        const companyCards = this
        let companyId = e.target.parentNode.parentNode.parentNode.id.split('-')[1]
        let companyCard = document.querySelector(`#card-${companyId}`)
        let companyHead = companyCard.querySelector('a')
        let editInfo = e.target

        editInfo.contentEditable = true

        editInfo.addEventListener('keydown', function(e) {
            if (e.key == "Enter") {
                let companyNameValue = companyCard.querySelector('ul li:nth-child(1)').innerText
                let companyUrlValue =  companyCard.querySelector('ul li:nth-child(2)').innerText
                let companyLocationValue = companyCard.querySelector('ul li:nth-child(3)').innerText

                const updatedCompanyObject = {
                    name: companyNameValue,
                    url: companyUrlValue,
                    location: companyLocationValue,
                }

                companyCards.adapterCompanies.updateCompany(updatedCompanyObject, companyId).then(company => {
                    editInfo.contentEditable = false
                    companyHead.href = companyUrlValue
                    companyHead.innerHTML = companyNameValue
                })
            }
        })
    }

    updateCompanyStatus(e) {
        let companyId = e.target.parentNode.parentNode.id.split('-')[1]
        let companyCard = document.querySelector(`#card-${companyId}`)
        let companyStatus = companyCard.querySelector('ul li:nth-child(5)')
        let responseButtons = companyCard.querySelectorAll(`.response-button`)
        let awaitButton = companyCard.querySelector(`.await-button`)
        let commentButton = companyCard.querySelector('.comment-button')
        let commentDeleteButtons = companyCard.querySelectorAll('.delete-comment-button')
        let statusPick = e.target.innerHTML

        let updateCompanyStatus = {
            status: statusPick
        }

        this.adapterCompanies.updateCompany(updateCompanyStatus, companyId).then(company => {
            if (statusPick === "Rejected") {
                companyCard.style.backgroundColor = "#AE4747"
                companyStatus.innerHTML = 'Rejected'
                companyCard.style.opacity = 0.50;
                commentDeleteButtons.forEach(commentDeleteButton => {commentDeleteButton.style.display = 'none'})
            } else if (statusPick === "Accepted") {
                companyCard.style.backgroundColor = "#77A867"
                companyStatus.innerHTML = 'Accepted'
                companyCard.style.opacity = 0.50;
                commentDeleteButtons.forEach(commentDeleteButton => {commentDeleteButton.style.display = 'none'})
            } else {
                companyCard.style.backgroundColor = '#EAE6DF'
                companyCard.style.opacity = null;
                companyStatus.innerHTML = 'Awaiting Response'
                commentDeleteButtons.forEach(commentDeleteButton => {commentDeleteButton.style.display = null})
            }
            responseButtons.forEach(responseButton => {responseButton.style.display = 'none'})
            awaitButton.style.display = 'none'
            commentButton.style.display = 'none'
        })
    }

    deleteCompany(e) {
        let companyId = e.target.parentNode.parentNode.id.split('-')[1]
        let companyCard = document.querySelector(`#card-${companyId}`)
        let companyComments = companyCard.querySelectorAll('.company-comments li')

        companyComments.forEach(companyComment => {
            let commentId = companyComment.id.split('-')[1]
            this.adapterComments.deleteComment(commentId)
        })

        // Communicate with the database to delete company.
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
            let companyStatus = companyCard.querySelector('ul').childNodes[4].innerText
            let table = document.querySelector('.total table tbody')
            let tableData = document.querySelector('.total tr:nth-child(2)')
            const trData = document.createElement('tr')
            const tdAccepted = document.createElement('td')
            const tdRejected = document.createElement('td')
            const tdAwaiting = document.createElement('td')
            const tdTotal = document.createElement('td')

            switch (companyStatus) {
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
        let commentButton = companyCard.querySelector(`.comment-button`)
        let companyStatus = companyCard.querySelector('ul li:nth-child(5)').innerHTML
        let commentForm = companyCard.querySelector('input')
        let commentSubmit = companyCard.querySelector('.submit-comment-button')
        let commentExit = companyCard.querySelector('.exit-comment-button')
        let responseButtons = companyCard.querySelectorAll(`.response-button`)

        if (e.target.innerHTML === "Leave a Comment") {
            commentButton.style.display = 'none'
            commentForm.style.display = null
            commentSubmit.style.display = null
            commentExit.style.display = null
            responseButtons.forEach(responseButton => {responseButton.style.display = 'none'})

        } else {
            commentButton.style.display = null
            commentForm.style.display = 'none'
            commentSubmit.style.display = 'none'
            commentExit.style.display = 'none'
            responseButtons.forEach(responseButton => { companyStatus === "Awaiting Response" ? responseButton.style.display = null:false })
        }
    }

    createComment(e) {
        let companyCards = document.querySelectorAll(`.company-card`)
        let companyId = e.target.parentNode.parentNode.id.split('-')[1]
        let companyCard = document.querySelector(`#card-${companyId}`)
        let commentValue = companyCard.querySelector(`input`).value

        const newComment = {
            company_id: companyId,
            content: commentValue
        }

        this.adapterComments.createComment(newComment).then(comment => {
            companyCards.forEach(companyCard => { companyCard.remove() })
            this.fetchCompanies()
        })
    }

    deleteComment(e) {
        let commentId = e.target.parentNode.id.split('-')[1]
        let commentLi = document.querySelector(`#comment-${commentId}`)

        this.adapterComments.deleteComment(commentId).then(comment => {
            commentLi.remove()
        })
    }
}