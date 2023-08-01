export class Login {
    private id:number;
    private user:String;
    private pwd:String;


    constructor(id:number, user:String, pwd:String) {
        this.id = id;
        this.user = user;
        this.pwd = pwd;
    }
}