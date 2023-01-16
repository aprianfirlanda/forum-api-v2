const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const Thread = require('../../../Domains/threads/entities/Thread');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const thread = {
        title: 'Judul Thread',
        body: 'Isi thread',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(thread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const thread = {
        title: 'Judul Thread',
        body: 'Isi thread',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(thread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'Judul Thread',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadExists function', () => {
    it('should throw not found error when thread not exists', async () => {
      // arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // action & assert
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-xxx')).rejects.toThrow(NotFoundError);
    });

    it('should resolve when thread exists', async () => {
      // arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // action & assert
      await expect(threadRepositoryPostgres.verifyThreadExists('thread-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('findThreadById function', () => {
    it('should throw not found error when thread not exists', async () => {
      // arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // action & assert
      await expect(threadRepositoryPostgres.findThreadById('thread-xxx')).rejects.toThrow(NotFoundError);
    });

    it('should resolve when thread exists', async () => {
      // arrange
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ time: new Date('2022-12-26') });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // action
      const thread = await threadRepositoryPostgres.findThreadById('thread-123');

      // assert
      expect(thread).toStrictEqual(new Thread({
        id: 'thread-123',
        title: 'Judul Thread',
        body: 'Isi thread',
        date: new Date('2022-12-26'),
        username: 'dicoding',
        comments: [],
      }));
    });
  });
});
