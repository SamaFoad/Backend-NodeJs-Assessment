class ServiceUnreachableException extends Error {
    public serviceName: string;
    constructor( serviceName: any) {
      super(serviceName);
      this.serviceName = serviceName;
    }
  }
  export default ServiceUnreachableException;
  