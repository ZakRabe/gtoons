export class SockerController {
  protected socket;
  protected io;

  constructor(socket, io) {
    this.socket = socket;
    this.io = io;
  }
}
