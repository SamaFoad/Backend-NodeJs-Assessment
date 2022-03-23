class OrmException extends Error {
  public message: any;
  public resourceName: string

  constructor( message: any, resourceName: string) {
    super(message);
    this.message = message;
    this.resourceName = resourceName;
  }
}
export default OrmException;
