import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parcel } from './parcel.entity';

type GetListReturnValue = {
    parcels: Parcel[],
    hasMoreItems: boolean;
    lastId: number;
};

@Injectable()
export class ParcelService {
    constructor(
        @InjectRepository(Parcel)
        private readonly parcelsRepository: Repository<Parcel>,
    ) { }

    public async getList({ first = 50, after = 0, term, countryName }:
        { first?: number; after?: number, term?: string, countryName?: string }
    ): Promise<GetListReturnValue> {
        const query = this.parcelsRepository.createQueryBuilder('parcel')
            .select(`
                "parcel"."id" as "id",
                "parcel"."sku" as "sku",
                "parcel"."description" as "description",
                "parcel"."streetAddress" as "streetAddress",
                "parcel"."town" as "town",
                "parcel"."deliveryDate" as "deliveryDate",
                "cntr"."name" as "country"
            `)
            .where("parcel.id > :after", { after })
            .leftJoin("parcel.country", "cntr")
            .orderBy(`(case when "cntr"."name" = 'Estonia' then 1 else 2 end)`, "ASC")
            .addOrderBy(`"parcel"."deliveryDate"`, "ASC")
            .limit(first + 1);

        if (term) {
            query.andWhere(`to_tsvector("parcel"."description") @@ to_tsquery(:term)`, { term });
        }

        if (countryName) {
            query.andWhere(`"cntr"."name" = :countryName`, { countryName });
        }

        const matchedParcels = await query.getRawMany();

        return {
            parcels: matchedParcels.slice(0, first),
            hasMoreItems: matchedParcels.length > first,
            lastId: matchedParcels.at(-1)?.id ?? 0
        };
    }

    public async add(newParcel: Partial<Parcel>): Promise<Parcel> {
        return this.parcelsRepository.save(newParcel);
    }
}
