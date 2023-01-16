const InvariantError = require('../../Commons/exceptions/InvariantError');

class ReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async addReply(threadId, commentId, requestPayload, credentialId) {
    const { content } = requestPayload;
    if (content === undefined) {
      throw new InvariantError('tidak dapat membuat balasan karena properti yang dibutuhkan tidak ada');
    }
    if (typeof content !== 'string') {
      throw new InvariantError('tidak dapat membuat balasan karena tipe data tidak sesuai');
    }
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    return this._replyRepository.addReply(commentId, content, credentialId);
  }

  async deleteReply(threadId, commentId, replyId, credentialId) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    await this._replyRepository.verifyReplyExists(replyId);
    await this._replyRepository.verifyReplyOwner(replyId, credentialId);
    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = ReplyUseCase;
