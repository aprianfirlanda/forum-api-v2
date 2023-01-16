const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');
const FindThreadUseCase = require('../../../../Applications/use_case/FindThreadUseCase');
const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: credentialId } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute(request.payload, credentialId);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async postCommentHandler(request, h) {
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const { threadId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const addedComment = await commentUseCase.addComment(threadId, request.payload, credentialId);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const commentUseCase = this._container.getInstance(CommentUseCase.name);
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await commentUseCase.deleteComment(threadId, commentId, credentialId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }

  async getThreadByIdHandler(request, h) {
    const findThreadUseCase = this._container.getInstance(FindThreadUseCase.name);
    const { threadId } = request.params;
    const thread = await findThreadUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }

  async postReplyHandler(request, h) {
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);
    const { threadId, commentId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const addedReply = await replyUseCase.addReply(
      threadId, commentId, request.payload, credentialId,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const replyUseCase = this._container.getInstance(ReplyUseCase.name);
    const { threadId, commentId, replyId } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await replyUseCase.deleteReply(threadId, commentId, replyId, credentialId);

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
