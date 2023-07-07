export class AuthRequiredError extends Error {
  constructor(message = "auth is required to access this page") {
    super(message)
    this.name = "AuthRequiredError"
  }
}
