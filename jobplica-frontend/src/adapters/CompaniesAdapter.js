// This adapter will talk to our backend API.
// Communicates to the API and relays that information to the frontend.
// The "middleman".

class CompaniesAdapter {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api/v1/companies'
    }

    getCompanies() {
        return fetch(this.baseUrl).then(resp => resp.json())
    }

    createCompany(companyObject) {
        const company = companyObject

        return fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({company}),
        }).then(resp => resp.json())
    }

    updateCompany(newCompanyObject, id) {
        const company = newCompanyObject

        return fetch(`${this.baseUrl}/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({company}),
        }).then(resp => resp.json())
    }

    deleteCompany(id) {
        return fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
            }
        }).then(resp => resp.json())
    }
}