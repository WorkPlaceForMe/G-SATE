import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class SessionStorageService {
  constructor(private http: HttpClient) {}

  setItems(userDetails: any) {
    sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
  }

  getItems() {
    return JSON.parse(sessionStorage.getItem("userDetails"));
  }

  removeItems() {
    sessionStorage.removeItem("userDetails");
  }
}
