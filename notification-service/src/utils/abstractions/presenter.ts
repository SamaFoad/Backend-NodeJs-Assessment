export default interface Presenter<UseCaseOutput> {
  show(lite: UseCaseOutput, original?: Record<string, any>): void;

  showMissingArgumentError(argName: string | string[]): void;
  showInvalidArgumentError(argName: string, expected: string): void;
  showFileSizeTooLargeError(maxSize: string): void;

  showNotSupportedError(thing: string): void;
  showPaginationNotSupportedError(type: string): void;

  showServiceUnreachableError(name: string): void;

  showSocialCredentialsError(): void;

  showOauthStateParseError(): void;

  showNotFoundError(): void;
  
  showDatabaseError(errorMessage: string, resourceName: string): void;
}
// Here we should do any transformation on the usecase's
// output data to make data suitable for display on view
// or other service consumption.
