import { ApiProperty } from "@nestjs/swagger";

class ParcelDto {
    @ApiProperty({ required: true, maxLength: 8 })
    sku: string;
    @ApiProperty()
    description: string;
    @ApiProperty({ required: true, maxLength: 255 })
    streetAddress: string;
    @ApiProperty({ required: true, maxLength: 255 })
    town: string;
    @ApiProperty({
        type: "string",
        format: "date-time",
        example: "2022-12-01T06:20:32.232Z",
    })
    deliveryDate: string;
}
export class AddParcelDto extends ParcelDto {
    @ApiProperty({
        required: true,
        description: "Country ID (from /countries)",
    })
    countryId: number;
}

export class AddedParcelDto extends ParcelDto {
    @ApiProperty()
    id: number;
    @ApiProperty()
    country: string;
}

export class PaginatedDto<T> {
    @ApiProperty({ description: "has more items matching the criteria" })
    hasMoreItems: boolean;

    @ApiProperty({ description: "how many items were returned" })
    first: number;

    @ApiProperty({ description: "offset" })
    after: number;

    parcels: T[];
}
