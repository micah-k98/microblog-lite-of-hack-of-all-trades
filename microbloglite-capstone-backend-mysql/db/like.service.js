const query = require('./database')
const {v4: uuidv4} = require('uuid')

class LikeService {

    async getByPostId(postId){
        const sql = `
            SELECT _id
                , username
                , postId
                , createdAt
            FROM likes
            WHERE postId = ?;
        `
        try {            
            const likes = await query(sql, [postId])
            return likes
        } catch (error) {
            console.log(error);
        }
    }

    async findExisting(like){
        const sql = `
            SELECT _id
                , username
                , postId
                , createdAt
            FROM likes
            WHERE postId = ?
                AND username = ?;
        `
        const response = await query(sql, [like.postId, like.username])

        return response.length > 0 ? response[0] : undefined
    }

    async getById(id){
        const sql = `
            SELECT _id
                , username
                , postId
                , createdAt
            FROM likes
            WHERE _id = ?;
        `
        const response = await query(sql, [id])

        return response.length > 0 ? response[0] : undefined
    }

    async addLike(like){
        const id = uuidv4()

        const sql = `
            INSERT INTO likes (_id, username, postId)
            VALUES (?,?,?);
        `
        const response = await query(sql, [id, like.username, like.postId])

        return await this.getById(id)
    }

    async delete(id) {
        const sql = `
            DELETE FROM likes
            WHERE _id = ?;
        `

        await query(sql, [id])
    }

    async deleteByPostId(postId) {
        const sql = `
            DELETE FROM likes
            WHERE postId = ?;
        `

        await query(sql, [postId])
    }

    async getLikes(limit, skip) {

        const sql = `
            SELECT _id
                , username
                , postId
                , createdAt
            FROM likes;
        `
        let likes = await query(sql, [limit, skip])

        likes = [...likes]

        return likes
    }

}

const likeService = new LikeService()

module.exports = likeService