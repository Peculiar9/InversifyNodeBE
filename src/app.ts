import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import * as express from "express";
import { DIContainer } from "./container/DIContainer";

// Import controllers (required for inversify-express-utils)
import "./controllers/warrior.controller";
import "./controllers/init.controller";

export class App {
    public static async createApp(): Promise<express.Application> {
        const container = DIContainer.resolveDependencies();
        
        const server = new InversifyExpressServer(container);
        
        server.setConfig((app) => {
            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));
        });

        const app = server.build();
        return app;
    }
}