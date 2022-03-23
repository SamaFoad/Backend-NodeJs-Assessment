import SuperTest, { Test } from 'supertest';
import dotenv from 'dotenv';
dotenv.config();
import App from '../app';
import mockServerNode from 'mockserver-node';
import { mockServerClient } from 'mockserver-client';
import RedisClient from 'redis-client';
import { sequelize } from '../infrastructure/models';

describe('Testing posts functionality', () => {
    let request: SuperTest.SuperTest<Test>;
    beforeEach(async () => {
        await sequelize.sync({
            force: true,
        });
    });
    beforeAll(async () => {
        const app = new App();
        request = SuperTest(app.getServer());
        await mockServerNode.start_mockserver({ serverPort: 1080, jvmOptions: '-Dmockserver.enableCORSForAllResponses=true' });
    });

    afterEach(async () => {
        await mockServerClient('localhost', 1080).reset();
    });
    afterAll(async () => {
        await mockServerNode.stop_mockserver({ serverPort: 1080 });
        // await removeSequelizeDb();
    });

    describe('[POST] /notifications', () => {
        it('creates notification successfully', async () => {
            const res = await request.post('/api/notifications').send({
                reciever: "sfoad@avaya.com",
                isSent: false,
                actionType: "Maintenance",
                sendingType: "manual",
                description: "This is manual notification unit test"
            });
            expect(res.statusCode).toEqual(200);
        });
    });
    describe('[GET] /notifications', () => {
        it('fetch notifications successfully', async () => {
            await request.post('/api/notifications').send({
                reciever: "sfoad@avaya.com",
                isSent: false,
                actionType: "Maintenance",
                sendingType: "manual",
                description: "This is manual notification unit test"
            });
            const res = await request.get(`/api/notifications?limit=10&page=0`);
            expect(res.statusCode).toEqual(200);
        });
        it('add defualt limit to fetch notifications ', async () => {
            await request.post('/api/notifications').send({
                reciever: "sfoad@avaya.com",
                isSent: false,
                actionType: "Maintenance",
                sendingType: "manual",
                description: "This is manual notification unit test"
            });
            const res = await request.get(`/api/notifications?page=0`);
            expect(res.statusCode).toEqual(200);
        });
        it('failed to fetch bad request no page', async () => {
            await request.post('/api/notifications').send({
                reciever: "sfoad@avaya.com",
                isSent: false,
                actionType: "Maintenance",
                sendingType: "manual",
                description: "This is manual notification unit test"
            });
            const res = await request.get(`/api/notifications?limit=10`);
            expect(res.statusCode).toEqual(400);
        });
    });
    describe('[GET] /notifications/:id', () => {
        it('fetch notifications successfully', async () => {
            const notification = await request.post('/api/notifications')
            .send({
                reciever: "sfoad@avaya.com",
                isSent: false,
                actionType: "Maintenance",
                sendingType: "manual",
                description: "This is manual notification unit test"
            });
            const res = await request.get(`/api/notifications/${notification.body.liteResponse.id}`);
            expect(res.statusCode).toEqual(200);
        });
        it('fetches not found social account', async () => {
            const acc = await request.get(`/api/notifications/1000`);
            expect(acc.statusCode).toEqual(404);
        });
    });
});