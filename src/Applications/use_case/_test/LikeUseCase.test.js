const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeUseCase = require('../LikeUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const LikeRepository = require('../../../Domains/likes/LikeRepository');

describe('LikeUseCase', () => {
  it('should orchestrating like action correctly', async () => {
    // arrange

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /* mockNeeded function */
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLikeExists = jest.fn()
      .mockRejectedValue(new NotFoundError());
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /* create use case instance */
    const likeUseCase = new LikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // action & assert
    await expect(likeUseCase.execute('thread-123', 'comment-123', 'user-123'))
      .resolves.not.toThrowError();
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123');
    expect(mockLikeRepository.verifyLikeExists).toBeCalledWith('comment-123', 'user-123');
    expect(mockLikeRepository.addLike).toBeCalledWith('comment-123', 'user-123');
  });

  it('should orchestrating unlike action correctly', async () => {
    // arrange

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /* mockNeeded function */
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyLikeExists = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /* create use case instance */
    const likeUseCase = new LikeUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // action & assert
    await expect(likeUseCase.execute('thread-123', 'comment-123', 'user-123'))
      .resolves.not.toThrowError();
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123');
    expect(mockLikeRepository.verifyLikeExists).toBeCalledWith('comment-123', 'user-123');
    expect(mockLikeRepository.deleteLike).toBeCalledWith('comment-123', 'user-123');
  });
});
