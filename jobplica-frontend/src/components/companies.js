class Companies {
    constructor() {
        this.companies = []
        this.adapter = new CompaniesAdapter()
        // this.bindEventListeners()
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
        let companiesContainer = document.querySelector('.company').innerHTML = 'ok'
    }
}