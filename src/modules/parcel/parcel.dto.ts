import { ApiProperty } from '@nestjs/swagger';

export class AddParcelDto {
    @ApiProperty({ required: true, maxLength: 64 })
    sku: string;
    @ApiProperty()
    description: string;
    @ApiProperty({ required: true, maxLength: 255 })
    streetAddress: string;
    @ApiProperty({ required: true, maxLength: 255 })
    town: string;
    @ApiProperty({ required: true, description: 'Country ID (from /countries)' })
    countryId: number;
    @ApiProperty({ type: 'string', format: 'date-time', example: '2022-12-01T06:20:32.232Z' })
    deliveryDate: string;
}
