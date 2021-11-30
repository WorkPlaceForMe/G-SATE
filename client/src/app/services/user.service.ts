import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ip } from "../models/IpServer";

@Injectable({
  providedIn: "root",
})
export class UserService {
  API_URL = "http://" + ip + ":3000/api";

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post(`${this.API_URL}/user/login`, {
      email,
      password,
    });
  }

  signup(obj: any) {
    return this.http.post<any>(`${this.API_URL}/user/signup`, obj);
  }

  verifyOtp(data: any) {
    return this.http.post(`${this.API_URL}/user/verify-otp`, data);
  }

  resendOtp(data: any) {
    return this.http.put(`${this.API_URL}/user/resend-otp`, data);
  }

  verificationStatus(email: string) {
    return this.http.get(`${this.API_URL}/user/verification-status/${email}`);
  }
}
