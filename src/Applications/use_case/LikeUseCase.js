class LikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId, commentId, credentialId) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    const isLike = await this._likeRepository.verifyLikeExists(commentId, credentialId);
    if (isLike) {
      await this._likeRepository.addLike(commentId, credentialId);
    } else {
      await this._likeRepository.deleteLike(commentId, credentialId);
    }
  }
}

module.exports = LikeUseCase;
