import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ParcelService } from "./parcel.service";
import { Parcel } from "./parcel.entity";
import { INestApplication } from "@nestjs/common";

describe("parcel.service", () => {
    let app: INestApplication;
    let parcelService: ParcelService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ParcelService,
                {
                    provide: getRepositoryToken(Parcel),
                    useValue: {
                        createQueryBuilder: jest.fn().mockReturnThis(),
                        select: jest.fn().mockReturnThis(),
                        where: jest.fn().mockReturnThis(),
                        leftJoin: jest.fn().mockReturnThis(),
                        orderBy: jest.fn().mockReturnThis(),
                        addOrderBy: jest.fn().mockReturnThis(),
                        limit: jest.fn().mockReturnThis(),
                        andWhere: jest.fn().mockReturnThis(),
                        getRawMany: jest.fn().mockResolvedValue([
                            {
                                id: 5,
                                sku: "1111",
                                description: "test description",
                                country: "Estonia",
                            },
                        ]),
                        save: jest.fn().mockResolvedValue({
                            id: 6,
                            sku: "2222",
                            description: "new description",
                            country: "US",
                        }),
                    },
                },
            ],
        }).compile();

        parcelService = moduleRef.get(ParcelService);
        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe("parcelService.getList", () => {
        it(`returns data from db in correct format`, async () => {
            const data = await parcelService.getList({});
            expect(data).toEqual({
                parcels: [
                    {
                        id: 5,
                        sku: "1111",
                        description: "test description",
                        country: "Estonia",
                    },
                ],
                hasMoreItems: false,
                lastId: 5,
            });
        });
    });

    describe("parcelService.add", () => {
        it(`returns data from db in correct format`, async () => {
            const data = await parcelService.add({
                sku: "2222",
                description: "new description",
                countryId: 11,
                streetAddress: "dfasf",
                town: "Kyiv",
                deliveryDate: "2022-12-01T06:20:32.232Z",
            });
            expect(data).toEqual({
                id: 6,
                sku: "2222",
                description: "new description",
                country: "US",
            });
        });
    });
});
