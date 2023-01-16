const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const Replies = require('../../../Domains/replies/entities/Replies');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentId = 'comment-123';
      const content = 'Isi balasan';
      const userId = 'user-123';
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, fakeIdGenerator,
      );

      // Action
      await replyRepositoryPostgres.addReply(commentId, content, userId);

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentId = 'comment-123';
      const content = 'Isi balasan';
      const userId = 'user-123';
      const fakeIdGenerator = () => '123'; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, fakeIdGenerator,
      );

      // Action
      const addedReply = await replyRepositoryPostgres
        .addReply(commentId, content, userId);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'Isi balasan',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyReplyExists function', () => {
    it('should throw not found error when reply not exists', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, {},
      );

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyExists('reply-xxx'))
        .rejects.toThrow(NotFoundError);
    });

    it('should resolve when reply exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, {},
      );

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyExists('reply-123'))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw forbidden error when reply id and user id not match', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, {},
      );

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-xxx', 'user-123'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should resolve when reply id and user id match', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, {},
      );

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReplyById function', () => {
    it('should persist and delete reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, {},
      );

      // Action
      await replyRepositoryPostgres.deleteReplyById('reply-123');

      // Assert
      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies[0].is_delete).toEqual(true);
    });
  });

  describe('findRepliesByCommentId function', () => {
    it('should return replies correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await RepliesTableTestHelper.addReply({ time: new Date('2022-12-29') });
      await RepliesTableTestHelper.addReply({ id: 'reply-456', isDelete: true, time: new Date('2022-12-30') });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool, {},
      );

      // Action
      const replies = await replyRepositoryPostgres.findRepliesByCommentId('comment-123');

      // Assert
      expect(replies).toBeInstanceOf(Array);
      expect(replies[0]).toStrictEqual(new Replies({
        id: 'reply-123',
        username: 'dicoding',
        date: new Date('2022-12-29'),
        content: 'Isi balasan',
      }));
      expect(replies[1]).toStrictEqual(new Replies({
        id: 'reply-456',
        username: 'dicoding',
        date: new Date('2022-12-30'),
        content: '**balasan telah dihapus**',
      }));
    });
  });
});
