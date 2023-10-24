import { TestBed } from "@angular/core/testing";

import { loginAdmin } from "./login.service";

describe("LoginService", () => {
  let service: loginAdmin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(loginAdmin);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
