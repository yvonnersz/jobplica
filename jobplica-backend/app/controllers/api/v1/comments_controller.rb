class Api::V1::CommentsController < ApplicationController

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
