const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentUseCase = require('../CommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('CommentUseCase', () => {
  describe('an addComment function', () => {
    it('should throw invariant error when request content undefined', async () => {
      // Arrange
      /* create use case instance */
      const commentUseCase = new CommentUseCase({
        threadRepository: {},
        commentRepository: {},
      });

      // Assert & Action
      await expect(commentUseCase.addComment('thread-123', {}, 'user-123'))
        .rejects.toThrow(InvariantError);
    });

    it('should throw invariant error when request content not string', async () => {
      // Arrange
      /* create use case instance */
      const commentUseCase = new CommentUseCase({
        threadRepository: {},
        commentRepository: {},
      });

      // Assert & Action
      await expect(commentUseCase.addComment('thread-123', { content: 123 }, 'user-123'))
        .rejects.toThrow(InvariantError);
    });

    it('should orchestrating the add comment action correctly', async () => {
      // arrange
      const expectedAddedComment = new AddedComment({
        id: 'comment-123',
        content: 'Isi komen',
        owner: 'user-123',
      });

      /* creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      /* mockNeeded function */
      mockThreadRepository.verifyThreadExists = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.addComment = jest.fn()
        .mockImplementation(() => Promise.resolve(new AddedComment({
          id: 'comment-123',
          content: 'Isi komen',
          owner: 'user-123',
        })));

      /* create use case instance */
      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // action
      const addedComment = await commentUseCase.addComment('thread-123', { content: 'Isi komen' }, 'user-123');

      // assert
      expect(addedComment).toStrictEqual(expectedAddedComment);
      expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
      expect(mockCommentRepository.addComment).toBeCalledWith('thread-123', 'Isi komen', 'user-123');
    });
  });

  describe('an deleteComment function', () => {
    it('should orchestrating the delete comment action correctly', async () => {
      // arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const userId = 'user-123';
      /* creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();

      /* mockNeeded function */
      mockThreadRepository.verifyThreadExists = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentExists = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentOwner = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.deleteCommentById = jest.fn()
        .mockImplementation(() => Promise.resolve());

      /* create use case instance */
      const commentUseCase = new CommentUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
      });

      // action & assert
      await expect(commentUseCase.deleteComment(threadId, commentId, userId))
        .resolves.not.toThrowError();
      expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
      expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(commentId);
      expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(commentId, userId);
      expect(mockCommentRepository.deleteCommentById).toBeCalledWith(commentId);
    });
  });
});
