export class IssueNotFoundError extends Error {
  constructor() {
    super("Issue Not Found");
  }
}
