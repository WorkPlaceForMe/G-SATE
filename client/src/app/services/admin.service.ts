import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ip } from "../models/IpServer";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  API_URL = "http://" + ip + ":3000/api";

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any>(`${this.API_URL}/admin/users`);
  }

  updateUserAccessibility(id: string, dateTime: any) {
    return this.http.put(`${this.API_URL}/admin/accessibility/${id}`, dateTime);
  }
}
