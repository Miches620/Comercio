export class Login {
  private id:number;
  private user:string;
  private pwd:string;


  constructor(id:number, user:string, pwd:string) {
    this.id = id;
    this.user = user;
    this.pwd = pwd;
  }
}