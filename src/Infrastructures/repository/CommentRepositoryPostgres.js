const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const Comments = require('../../Domains/comments/entities/Comments');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(threadId, content, owner) {
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, threadId, content, owner],
    };

    const result = await this._pool.query(query);

    return new AddedComment(result.rows[0]);
  }

  async verifyCommentExists(commentId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, userId) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('anda bukan pemilik komentar');
    }
  }

  async deleteCommentById(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async findCommentsByThreadId(threadId) {
    const query = {
      text: 'select comments.id                      as id,\n'
        + '       username,\n'
        + '       time                             as date,\n'
        + '       content,\n'
        + '       is_delete                        as isdelete,\n'
        + '       (select count(likes.id)\n'
        + '        from likes\n'
        + '        where comment_id = comments.id) as likeCount\n'
        + 'from comments\n'
        + '         inner join users on users.id = comments.owner\n'
        + 'where comments.thread_id = $1\n'
        + 'order by time',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((data) => new Comments(data));
  }
}

module.exports = CommentRepositoryPostgres;
