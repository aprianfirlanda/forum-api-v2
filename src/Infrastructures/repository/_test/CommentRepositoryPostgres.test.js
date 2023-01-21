const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const Comments = require('../../../Domains/comments/entities/Comments');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const threadId = 'thread-123';
      const content = 'Isi komen';
      const userId = 'user-123';
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(threadId, content, userId);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const threadId = 'thread-123';
      const content = 'Isi komen';
      const userId = 'user-123';
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, fakeIdGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres
        .addComment(threadId, content, userId);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'Isi komen',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyCommentExists function', () => {
    it('should throw not found error when comment not exists', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, {},
      );

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExists('comment-xxx'))
        .rejects.toThrow(NotFoundError);
    });

    it('should resolve when comment exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, {},
      );

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExists('comment-123'))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw forbidden error when comment id and user id not match', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, {},
      );

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-xxx', 'user-123'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should resolve when comment id and user id match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, {},
      );

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should persist and delete comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, {},
      );

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-123');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments[0].is_delete).toEqual(true);
    });
  });

  describe('findCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({ time: new Date('2022-12-27') });
      await CommentsTableTestHelper.addComment({ id: 'comment-456', isDelete: true, time: new Date('2022-12-28') });
      await LikesTableTestHelper.addLike({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool, {},
      );

      // Action
      const comments = await commentRepositoryPostgres.findCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toBeInstanceOf(Array);
      expect(comments[0]).toEqual(new Comments({
        id: 'comment-123',
        username: 'dicoding',
        date: new Date('2022-12-27'),
        content: 'Isi komen',
        replies: [],
        likecount: '1',
      }));
      expect(comments[1]).toEqual(new Comments({
        id: 'comment-456',
        username: 'dicoding',
        date: new Date('2022-12-28'),
        content: '**komentar telah dihapus**',
        replies: [],
        likecount: '0',
      }));
    });
  });
});
