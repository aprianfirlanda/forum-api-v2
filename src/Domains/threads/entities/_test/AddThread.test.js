const AddThread = require('../AddThread');

describe('AddThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      body: 'Isi thread',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'Judul Thread',
      body: 'Isi thread',
      owner: 1234,
    };

    // Action & Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'Judul Thread',
      body: 'Isi thread',
      owner: 'user-123',
    };

    // Action
    const addedThread = new AddThread(payload);

    // Assert
    expect(addedThread).toBeInstanceOf(AddThread);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.body).toEqual(payload.body);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
