class LikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId, commentId, credentialId) {
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    await this._likeRepository.verifyLikeExists(commentId, credentialId)
      .then(
        async () => {
          await this._likeRepository.deleteLike(commentId, credentialId);
        },
        async () => {
          await this._likeRepository.addLike(commentId, credentialId);
        },
      );
  }
}

module.exports = LikeUseCase;
