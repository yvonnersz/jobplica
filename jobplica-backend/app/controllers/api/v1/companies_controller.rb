class Api::V1::CompaniesController < ApplicationController
    ## Api::V1 so when you're making a request from another origin, you know that this particular application is an API-only type app.
    ## It's only sending data and not rendering any type of use.
    ## A convention used bycompanies.

    def index
        companies = Company.all
        render json: companies
    end

    def show
        company = Company.find(params[:id])
        render json: company
    end

    def create
        company = Company.create(company_params)
        render json: company
    end

    def update
        company = Company.find(params[:id])
        company.update(company_params)
        render json: company
    end

    def destroy
        company = Company.find(params[:id])
        company.delete
        render json: {companyId: company.id}
    end

    private

    def company_params
        params.require(:company).permit(:name, :location, :url, :date_applied, :takeaway, :status)
    end
end
