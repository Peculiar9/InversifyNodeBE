import { App } from "./app";

const PORT = 3000;

(async () => {
    try {
        const app = await App.createApp();
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
})();