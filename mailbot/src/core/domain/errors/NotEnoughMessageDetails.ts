export class NotEnoughtMessageDetails extends Error {
  constructor(messageId: string) {
    super(`mensagem ${messageId} com detalhes incompletos`);
  }
}
