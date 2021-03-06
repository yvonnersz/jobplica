class Api::V1::CompaniesController < ApplicationController

    def index
        companies = Company.all
        render json: companies, include: :comments
    end

    def show
        company = Company.find(params[:id])
        render json: company, include: :comments
    end

    def create
        company = Company.create(company_params)
        render json: company, include: :comments
    end

    def update
        company = Company.find(params[:id])
        company.update(company_params)
        render json: company, include: :comments
    end

    def destroy
        company = Company.find(params[:id])
        company.delete
        render json: {companyId: company.id}
    end

    private

    def company_params
        params.require(:company).permit(:name, :location, :url, :date_applied, :status, comments: [])
    end
end
