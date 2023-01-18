const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist and add like correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentId = 'comment-123';
      const userId = 'user-123';
      const fakeIdGenerator = () => '123'; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool, fakeIdGenerator,
      );

      // Action
      await likeRepositoryPostgres.addLike(commentId, userId);

      // Assert
      const comments = await LikesTableTestHelper.findLikesById('like-123');
      expect(comments).toHaveLength(1);
    });
  });

  describe('deleteLike function', () => {
    it('should persist and delete comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLike({});
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool, {},
      );

      // Action
      await likeRepositoryPostgres.deleteLike('comment-123', 'user-123');

      // Assert
      const comments = await LikesTableTestHelper.findLikesById('like-123');
      expect(comments).toHaveLength(0);
    });
  });

  describe('verifyLikeExists function', () => {
    it('should throw not found error when like not exists', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool, {},
      );

      // Action & Assert
      await expect(likeRepositoryPostgres.verifyLikeExists('comment-123', 'user-123'))
        .toBeTruthy();
    });

    it('should resolve when like exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      await LikesTableTestHelper.addLike({});
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool, {},
      );

      // Action & Assert
      await expect(likeRepositoryPostgres.verifyLikeExists('comment-123', 'user-123'))
        .toBeFalsy();
    });
  });
});
