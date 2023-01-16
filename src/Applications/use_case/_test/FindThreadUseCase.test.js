const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const FindThreadUseCase = require('../FindThreadUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');

describe('FindThreadUseCase', () => {
  describe('an findThreadById function', () => {
    it('should orchestrating the find thread action correctly', async () => {
      // arrange
      /* creating dependency of use case */
      const mockThreadRepository = new ThreadRepository();
      const mockCommentRepository = new CommentRepository();
      const mockReplyRepository = new ReplyRepository();

      /* mockNeeded function */
      mockThreadRepository.findThreadById = jest.fn()
        .mockImplementation(() => Promise.resolve({
          id: 'thread-123',
          title: 'Judul Thread',
          body: 'Isi thread',
          date: new Date('2022-01-25'),
          username: 'dicoding',
        }));
      mockCommentRepository.findCommentsByThreadId = jest.fn()
        .mockImplementation(() => Promise.resolve([
          {
            id: 'comment-123',
            username: 'dicoding',
            date: new Date('2022-01-26'),
            content: 'Isi komen',
          },
          {
            id: 'comment-456',
            username: 'dicoding',
            date: new Date('2022-01-27'),
            content: 'Isi komen',
          },
        ]));
      mockReplyRepository.findRepliesByCommentId = jest.fn()
        .mockImplementation(() => Promise.resolve([
          {
            id: 'reply-123',
            username: 'dicoding',
            date: new Date('2022-01-28'),
            content: 'Isi balasan',
          },
          {
            id: 'reply-456',
            username: 'dicoding',
            date: new Date('2022-01-29'),
            content: 'Isi balasan',
          },
        ]));

      /* create use case instance */
      const findThreadUseCase = new FindThreadUseCase({
        threadRepository: mockThreadRepository,
        commentRepository: mockCommentRepository,
        replyRepository: mockReplyRepository,
      });

      // action
      const thread = await findThreadUseCase.execute('thread-123');

      // assert
      expect(mockThreadRepository.findThreadById).toBeCalledWith('thread-123');
      expect(mockCommentRepository.findCommentsByThreadId).toBeCalledWith('thread-123');
      expect(mockReplyRepository.findRepliesByCommentId).toBeCalledTimes(2);
      expect(mockReplyRepository.findRepliesByCommentId).toBeCalledWith('comment-123');
      expect(mockReplyRepository.findRepliesByCommentId).toBeCalledWith('comment-456');
      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'Judul Thread',
        body: 'Isi thread',
        date: new Date('2022-01-25'),
        username: 'dicoding',
        comments: [
          {
            id: 'comment-123',
            username: 'dicoding',
            date: new Date('2022-01-26'),
            content: 'Isi komen',
            replies: [
              {
                id: 'reply-123',
                username: 'dicoding',
                date: new Date('2022-01-28'),
                content: 'Isi balasan',
              },
              {
                id: 'reply-456',
                username: 'dicoding',
                date: new Date('2022-01-29'),
                content: 'Isi balasan',
              },
            ],
          },
          {
            id: 'comment-456',
            username: 'dicoding',
            date: new Date('2022-01-27'),
            content: 'Isi komen',
            replies: [
              {
                id: 'reply-123',
                username: 'dicoding',
                date: new Date('2022-01-28'),
                content: 'Isi balasan',
              },
              {
                id: 'reply-456',
                username: 'dicoding',
                date: new Date('2022-01-29'),
                content: 'Isi balasan',
              },
            ],
          },
        ],
      });
    });
  });
});
