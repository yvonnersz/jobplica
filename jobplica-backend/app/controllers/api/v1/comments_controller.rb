class Api::V1::CommentsController < ApplicationController
    ## Api::V1 so when you're making a request from another origin, you know that this particular application is an API-only type app.
    ## It's only sending data and not rendering any type of use.
    ## A convention used bycompanies.

    def index
        comments = Comment.all
        render json: comments
    end

    def show
        comment = Comment.find(params[:id])
        render json: comment
    end

    def create
        comment = Comment.create(comment_params)
        render json: comment
    end

    def update
        comment = Comment.find(params[:id])
        comment.update(comment_params)
        render json: comment
    end

    def destroy
        comment = Comment.find(params[:id])
        comment.delete
        render json: {commentId: comment.id}
    end

    private

    def comment_params
        params.require(:comment).permit(:content, :company_id)
    end
end
