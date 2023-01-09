export class UtilsResources {

  public static baseUrl = "http://uatlinux.wirepick.com:9090/wpksurvey-api-1.2.1";
  //public static baseUrl = "http://uatlinux.wirepick.com:9090/wpksurvey-api-1.2.0";
  //public static baseUrl = "http://uatlinux.wirepick.com:8080/ecobanksurvey-api-1.0.1";
  //public static baseUrl = "http://162.222.160.100:8080/ecobanksurvey-api-0.0.1";
  //public static baseUrl = "http://216.105.85.67:8080/ecobanksurvey-api-0.0.1";
  //public static baseUrl = "http://localhost:8080/ecobanksurvey-api-0.0.1";

  public static SUCCESS = 'SUCCESS';
  public static ERROR = 'ERROR';
  public static DENIED = 'DENIED';

  public static generateRandomString(limit: number) {
    const chars ='abcdefghijklmnopqrstuvwxyz0123456789';
    let result= '';
    for ( let i = 0; i < 5; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
