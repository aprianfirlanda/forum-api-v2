/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment(
    {
      id = 'comment-123',
      threadId = 'thread-123',
      content = 'Isi komen',
      owner = 'user-123',
      isDelete = false,
      time = new Date(),
    },
  ) {
    const query = {
      text: 'INSERT INTO comments(id, thread_id, content, owner, is_delete, time) VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, threadId, content, owner, isDelete, time],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
