import { controller, httpGet } from "inversify-express-utils";

@controller("/")
export class InitController {
    constructor() { }

    @httpGet("")
    public fight(): string {
        return "base route. Hello World Fellas";
    }
}