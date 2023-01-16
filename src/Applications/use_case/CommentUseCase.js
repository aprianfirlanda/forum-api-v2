const InvariantError = require('../../Commons/exceptions/InvariantError');

class CommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addComment(threadId, requestPayload, credentialId) {
    const { content } = requestPayload;
    if (content === undefined) {
      throw new InvariantError('tidak dapat membuat komentar karena properti yang dibutuhkan tidak ada');
    }
    if (typeof content !== 'string') {
      throw new InvariantError('tidak dapat membuat komentar karena tipe data tidak sesuai');
    }
    await this._threadRepository.verifyThreadExists(threadId);
    return this._commentRepository.addComment(threadId, content, credentialId);
  }

  async deleteComment(threadId, commentId, credentialId) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, credentialId);
    await this._commentRepository.deleteCommentById(commentId);
  }
}

module.exports = CommentUseCase;
