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
    return this.http.post(`${this.API_URL}/user/signup`, obj);
  }
}
