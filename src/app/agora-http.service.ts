import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgoraHTTPService {
  constructor(private http: HttpClient) {}

  getAcquire(reqObj: any) {
    const url = `https://api.agora.io/v1/apps/${environment.appId}/cloud_recording/acquire`;
    const headers = new HttpHeaders({'Authorization': this.getBase64(), 'Content-Type': 'application/json'});
    // headers.append('Authorization', this.getBase64());
    return this.http.post(url, reqObj, {
      headers: headers
    });
  }
  getBase64() {
    const plainCredentials =
      environment.customerId + ':' + environment.secretKey;
    const base64Credentials = btoa(plainCredentials);
    const authorizationHeader = 'Basic ' + base64Credentials;
    return authorizationHeader;
  }
}
