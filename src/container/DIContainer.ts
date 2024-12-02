import { Container } from "inversify";
import { TYPES } from "../types";
import { Warrior, Weapon, ThrowableWeapon } from "../interfaces";
import { Ninja, Katana, Shuriken } from "../entities";
import { WarriorController } from "../controllers/warrior.controller";

export class DIContainer {
    private static container: Container;

    public static resolveDependencies(): Container {
        if (!this.container) {
            this.container = new Container();
            this.registerDependencies();
        }
        return this.container;
    }

    private static registerDependencies(): void {
        this.container.bind<Warrior>(TYPES.Warrior).to(Ninja);
        this.container.bind<Weapon>(TYPES.Weapon).to(Katana);
        this.container.bind<ThrowableWeapon>(TYPES.ThrowableWeapon).to(Shuriken);
        this.container.bind<WarriorController>(TYPES.WarriorController).to(WarriorController);
    }
}