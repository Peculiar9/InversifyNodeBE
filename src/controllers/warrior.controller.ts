import { controller, httpGet } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../types";
import { Warrior } from "../interfaces";

@controller("/warrior")
export class WarriorController {
    constructor(@inject(TYPES.Warrior) private warrior: Warrior) {}

    @httpGet("/fight")
    public fight(): string {
        return this.warrior.fight();
    }

    @httpGet("/sneak")
    public sneak(): string {
        return this.warrior.sneak();
    }
}