const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ReplyUseCase = require('../ReplyUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('ReplyUseCase', () => {
  describe('an addReply function', () => {
    it('should throw invariant error when request content undefined', async () => {
      // Arrange
      /* create use case instance */
      const replyUseCase = new ReplyUseCase({
        threadRepository: {},
        commentRepository: {},
      });

      // Assert & Action
      await expect(replyUseCase.addReply('thread-123', 'comment-123', { }, 'user-123'))
        .rejects.toThrow(InvariantError);
    });

    it('should throw invariant error when request content not string', async () => {
      // Arrange
      /* create use case instance */
      const replyUseCase = new ReplyUseCase({
        threadRepository: {},
        commentRepository: {},
      });

      // Assert & Action
      await expect(replyUseCase.addReply('thread-123', 'comment-123', { content: 123 }, 'user-123'))
        .rejects.toThrow(InvariantError);
    });

    it('should orchestrating the add reply action correctly', async () => {
      // arrange
      const expectedAddedReply = new AddedReply({
        id: 'reply-123',
        content: 'Isi balasan',
        owner: 'user-123',
      });

      /* creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /* mockNeeded function */
      mockThreadRepository.verifyThreadExists = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentExists = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.addReply = jest.fn()
        .mockImplementation(() => Promise.resolve(new AddedReply({
          id: 'reply-123',
          content: 'Isi balasan',
          owner: 'user-123',
        })));

      /* create use case instance */
      const replyUseCase = new ReplyUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // action
      const addedThread = await replyUseCase.addReply('thread-123', 'comment-123', { content: 'Isi balasan' }, 'user-123');

      // assert
      expect(addedThread).toStrictEqual(expectedAddedReply);
      expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
      expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123');
      expect(mockReplyRepository.addReply).toBeCalledWith('comment-123', 'Isi balasan', 'user-123');
    });
  });

  describe('an deleteReply function', () => {
    it('should orchestrating the delete reply action correctly', async () => {
      // arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const replyId = 'reply-123';
      const userId = 'user-123';
      /* creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /* mockNeeded function */
      mockThreadRepository.verifyThreadExists = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockCommentRepository.verifyCommentExists = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.verifyReplyExists = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.verifyReplyOwner = jest.fn()
        .mockImplementation(() => Promise.resolve());
      mockReplyRepository.deleteReplyById = jest.fn()
        .mockImplementation(() => Promise.resolve());

      /* create use case instance */
      const replyUseCase = new ReplyUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // action & assert
      await expect(replyUseCase.deleteReply(threadId, commentId, replyId, userId))
        .resolves.not.toThrowError();
      expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(threadId);
      expect(mockCommentRepository.verifyCommentExists).toBeCalledWith(commentId);
      expect(mockReplyRepository.verifyReplyExists).toBeCalledWith(replyId);
      expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(replyId, userId);
      expect(mockReplyRepository.deleteReplyById).toBeCalledWith(replyId);
    });
  });
});
