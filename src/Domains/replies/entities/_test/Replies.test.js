const Replies = require('../Replies');

describe('Replies entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      date: new Date(),
      content: 'Isi balasan',
    };

    // Action & Assert
    expect(() => new Replies(payload)).toThrowError('REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: new Date(),
      content: 123,
    };

    // Action & Assert
    expect(() => new Replies(payload)).toThrowError('REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Replies entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'dicoding',
      date: new Date(),
      content: 'Isi balasan',
    };

    // Action
    const replies = new Replies(payload);

    // Assert
    expect(replies).toBeInstanceOf(Replies);
    expect(replies.id).toEqual(payload.id);
    expect(replies.username).toEqual(payload.username);
    expect(replies.date).toEqual(payload.date);
    expect(replies.content).toEqual(payload.content);
  });
});
