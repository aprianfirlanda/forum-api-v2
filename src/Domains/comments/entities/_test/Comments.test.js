const Comments = require('../Comments');

describe('Comments entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      date: new Date(),
      content: 'Isi komen',
    };

    // Action & Assert
    expect(() => new Comments(payload)).toThrowError('COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 123,
    };

    // Action & Assert
    expect(() => new Comments(payload)).toThrowError('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comments entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'Isi komen',
    };

    // Action
    const comments = new Comments(payload);

    // Assert
    expect(comments).toBeInstanceOf(Comments);
    expect(comments.id).toEqual(payload.id);
    expect(comments.username).toEqual(payload.username);
    expect(comments.date).toEqual(payload.date);
    expect(comments.content).toEqual(payload.content);
    expect(comments.replies).toEqual([]);
  });
});
