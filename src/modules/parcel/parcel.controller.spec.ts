import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ParcelController } from './parcel.controller';
import { ParcelService } from './parcel.service';
import { INestApplication } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

describe('parcel.controller', () => {
    let app: INestApplication;
    let getList: jest.Mock;
    let add: jest.Mock;
 
    const getListReturnValue = {
        parcels: [{
            id: 5,
            sku: '1111',
            description: 'test description',
            country: 'Estonia',
        }],
        hasMoreItems: false,
        lastId: 5,
    };

    beforeAll(async () => {
        getList = jest.fn().mockResolvedValue(getListReturnValue);
        add = jest.fn().mockImplementation(data => Promise.resolve(data));

        const moduleRef = await Test.createTestingModule({
            controllers: [ParcelController],
            providers: [{
                provide: ParcelService,
                useValue: {
                    getList,
                    add,
                },
            }],
        })
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });
 
    beforeEach(() => {
        getList.mockClear();
        add.mockClear();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/GET parcels', () => {
        it('returns data returned by parcelService', async () => {
            return request(app.getHttpServer())
            .get('/parcels')
            .expect(200)
            .expect(getListReturnValue);
        });

        it('returns passes query params', async () => {
            await request(app.getHttpServer())
            .get('/parcels?first=40&after=40&term=testsearch&countryName=United%20States')
            .expect(200);

            expect(getList.mock.calls[0]).toEqual([{
                first: '40',
                after: '40',
                term: 'testsearch',
                countryName: 'United States',
            }]);
        });
    });

    describe('/POST parcels', () => {
        it('returns created parcel data from parcelService', async () => {
            return request(app.getHttpServer())
            .post('/parcels')
            .send({
                sku: '111',
                description: 'test',
            })
            .expect(201)
            .expect({
                sku: '111',
                description: 'test',
            });
        });
        it('return Duplicate SKU error if service throws duplicate key error', async () => {
            add.mockReset().mockRejectedValue(new QueryFailedError('query failed', undefined, new Error('duplicate key')));
            return request(app.getHttpServer())
            .post('/parcels')
            .send({
                sku: '111',
                description: 'test',
            })
            .expect(400)
            .expect({ statusCode: 400, message: 'Duplicate SKU not allowed' });
        });
        it('return Bad Payload if service return error on duplicate sku', async () => {
            add.mockReset().mockRejectedValue(new QueryFailedError('query failed', undefined, 'something happened'));
            return request(app.getHttpServer())
            .post('/parcels')
            .send({
                sku: '111',
                description: 'test',
            })
            .expect(400)
            .expect({ statusCode: 400, message: 'Bad payload' });
        });
    });
});
