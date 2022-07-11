import express, { Request, Response } from 'express';
import userAPI from '@/routers/user';

export default (app: express.Application) => {
    app.get('/', (req, res) => res.send('Hello Login'));
    app.use('/api/user', userAPI);
}