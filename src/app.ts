import express from 'express';
import routers from '@/routers/index';

class App {
    public server: express.Application;
    public port: number;

    constructor() {
        this.server = express();
        this.port = Number(process.env.PORT) || 8080;
    }

    bootstrap() {
        routers(this.server);
    }
}

const app = new App();
app.bootstrap();

export default app;