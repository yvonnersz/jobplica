class CommentsAdapter {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api/v1/comments'
    }

    createComment(commentObject) {
        const comment = commentObject

        return fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({comment}),
        }).then(resp => resp.json())
    }
}