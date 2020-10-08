class CommentsAdapter {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api/v1/comments'
    }

    createComment(commentObject) {
        const comment = commentObject

        return fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({comment}),
        }).then(resp => resp.json())
    }

    deleteComment(id) {
        return fetch(`${this.baseUrl}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(resp => resp.json())
    }
}