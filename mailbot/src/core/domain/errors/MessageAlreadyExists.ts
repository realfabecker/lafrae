export class MessageAlreadyExists extends Error {
  constructor() {
    super("Message Already Exists");
  }
}
