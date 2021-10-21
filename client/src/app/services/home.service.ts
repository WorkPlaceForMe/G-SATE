import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ip } from "../models/IpServer";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  API_URL = "http://" + ip + ":3000/api";

  constructor(private http: HttpClient) {}

  addToContacts(contactData: any) {
    return this.http.post(`${this.API_URL}/home/contact`, contactData);
  }
}
