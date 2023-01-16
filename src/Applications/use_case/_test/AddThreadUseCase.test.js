const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');
const AddThread = require('../../../Domains/threads/entities/AddThread');

describe('AddAddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // arrange
    const requestPayload = {
      title: 'Judul Thread',
      body: 'Isi thread',
    };
    const owner = 'user-123';
    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: 'Judul Thread',
      owner: 'user-123',
    });

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /* mockNeeded function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedThread({
        id: 'thread-123',
        title: 'Judul Thread',
        owner: 'user-123',
      })));

    /* create use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // action
    const addedThread = await addThreadUseCase.execute(requestPayload, owner);

    // assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: requestPayload.title,
      body: requestPayload.body,
      owner,
    }));
  });
});
