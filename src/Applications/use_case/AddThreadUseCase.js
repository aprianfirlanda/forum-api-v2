const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(requestPayload, credentialId) {
    const { title, body } = requestPayload;
    const addThread = new AddThread({ title, body, owner: credentialId });
    return this._threadRepository.addThread(addThread);
  }
}

module.exports = AddThreadUseCase;
