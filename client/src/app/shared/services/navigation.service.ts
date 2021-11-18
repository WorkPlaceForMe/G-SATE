import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  public isUserLoggedIn: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public userName: BehaviorSubject<string> = new BehaviorSubject<string>("");
  public isUserAdmin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public hasService1: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public hasService2: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public hasService3: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public hasService4: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public hasService5: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public hasService6: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {}
}
