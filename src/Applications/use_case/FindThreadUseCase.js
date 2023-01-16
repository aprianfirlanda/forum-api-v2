class FindThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.findThreadById(threadId);
    thread.comments = await this._commentRepository.findCommentsByThreadId(threadId);
    // eslint-disable-next-line no-restricted-syntax
    for (const comment of thread.comments) {
      // eslint-disable-next-line no-await-in-loop
      comment.replies = await this._replyRepository.findRepliesByCommentId(comment.id);
    }

    return thread;
  }
}

module.exports = FindThreadUseCase;
