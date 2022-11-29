import { Controller, Get, Post, Query, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiPropertyOptional }from '@nestjs/swagger';
import { QueryFailedError } from 'typeorm';
import { ParcelService } from './parcel.service';
import { AddParcelDto } from './parcel.dto';


class GetListQueryParams {
    @ApiPropertyOptional()
    first?: number;
    @ApiPropertyOptional()
    after?: number;
    @ApiPropertyOptional()
    term?: string;
    @ApiPropertyOptional()
    countryName?: string;
  }

@Controller('parcels')
export class ParcelController {
    constructor(private readonly parcelService: ParcelService) {}

    @Get()
    public async findAll(@Query() params: GetListQueryParams) {
        return this.parcelService.getList(params);
    }

    @Post()
    public async create(@Body() payload: AddParcelDto) {
        try {
        return await this.parcelService.add(payload);
        } catch (error) {
            console.log(error)
            if (error instanceof QueryFailedError) {
                if (error.driverError?.message?.includes('duplicate key')) {
                    throw new HttpException('Duplicate SKU not allowed', HttpStatus.BAD_REQUEST, {
                        cause: error,
                    });
                }
                throw new HttpException('Bad payload', HttpStatus.BAD_REQUEST, {
                    cause: error,
                });
            }

            throw error;
        }
    }
}
