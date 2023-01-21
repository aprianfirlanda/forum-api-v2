class Comments {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, isdelete, likecount,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isdelete ? '**komentar telah dihapus**' : content;
    this.replies = [];
    this.likeCount = parseInt(likecount, 10);
  }

  /* eslint class-methods-use-this: "off" */
  _verifyPayload({
    id, username, date, content, likecount,
  }) {
    if (!id || !username || !date || !content || !likecount) {
      throw new Error('COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'object'
      || typeof content !== 'string' || typeof parseInt(likecount, 10) !== 'number') {
      throw new Error('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comments;
