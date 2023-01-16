const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const Replies = require('../../Domains/replies/entities/Replies');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(commentId, content, owner) {
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, commentId, content, owner],
    };

    const result = await this._pool.query(query);

    return new AddedReply(result.rows[0]);
  }

  async verifyReplyExists(replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    }
  }

  async verifyReplyOwner(replyId, userId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1 AND owner = $2',
      values: [replyId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('anda bukan pemilik balasan');
    }
  }

  async deleteReplyById(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async findRepliesByCommentId(commentId) {
    const query = {
      text: 'select replies.id as id,\n'
        + '       username,\n'
        + '       time               as date,\n'
        + '       content,\n'
        + '       is_delete          as isdelete\n'
        + 'from replies\n'
        + '         inner join users on users.id = replies.owner\n'
        + 'where replies.comment_id = $1\n'
        + 'order by time',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((data) => new Replies(data));
  }
}

module.exports = ReplyRepositoryPostgres;
