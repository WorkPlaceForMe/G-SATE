import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../models/User";
import { Image } from "../models/Image";
import { Camera } from "../models/Camera";
import { ip } from "../models/IpServer";
import { Observable } from "rxjs";
import { Day } from "src/app/models/Day";
import { Relation } from "src/app/models/Relation";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  API_URI = "http://" + ip + ":3000/api";
  API_LOCAL = "http://localhost:3001/api";

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    let header = new HttpHeaders({ "X-API-KEY": environment.xApiKey });

    return this.http.post(
      `${this.API_LOCAL}/user/login`,
      {
        email,
        password,
      },
      { headers: header }
    );
  }

  signup(obj: any) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("X-API-KEY", environment.xApiKey);

    return this.http.post(`${this.API_LOCAL}/user/signup`, obj, { headers });
  }
}
