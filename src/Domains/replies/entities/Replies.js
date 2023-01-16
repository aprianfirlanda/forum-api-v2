class Replies {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, isdelete,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isdelete ? '**balasan telah dihapus**' : content;
  }

  /* eslint class-methods-use-this: "off" */
  _verifyPayload({
    id, username, date, content,
  }) {
    if (!id || !username || !date || !content) {
      throw new Error('REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'object' || typeof content !== 'string') {
      throw new Error('REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Replies;
