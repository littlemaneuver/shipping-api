import {
    Controller,
    Get,
    Post,
    Query,
    Body,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import {
    ApiPropertyOptional,
    ApiOkResponse,
    ApiBadRequestResponse,
    getSchemaPath,
    ApiCreatedResponse,
    ApiExtraModels,
} from "@nestjs/swagger";
import { QueryFailedError } from "typeorm";
import { ParcelService } from "./parcel.service";
import { AddParcelDto, AddedParcelDto, PaginatedDto } from "./parcel.dto";

class GetListQueryParams {
    @ApiPropertyOptional({
        description: "how many parcels to return (limit)",
        default: 50,
    })
    first?: number;
    @ApiPropertyOptional()
    @ApiPropertyOptional({
        description: "parcel id to start from (cursor)",
        default: 0,
    })
    after?: number;
    @ApiPropertyOptional()
    term?: string;
    @ApiPropertyOptional()
    countryName?: string;
}

@Controller("parcels")
@ApiExtraModels(PaginatedDto)
export class ParcelController {
    constructor(private readonly parcelService: ParcelService) {}

    @Get()
    @ApiOkResponse({
        schema: {
            allOf: [
                { $ref: getSchemaPath(PaginatedDto) },
                {
                    properties: {
                        parcels: {
                            type: "array",
                            items: { $ref: getSchemaPath(AddedParcelDto) },
                        },
                    },
                },
            ],
        },
    })
    public async findAll(
        @Query() params: GetListQueryParams
    ): Promise<PaginatedDto<AddedParcelDto>> {
        return this.parcelService.getList(params);
    }

    @Post()
    @ApiCreatedResponse({
        description: "parcel was succesfully created",
        type: AddedParcelDto,
    })
    @ApiBadRequestResponse({ description: "Duplicate SKU not allowed" })
    @ApiBadRequestResponse({ description: "Bad payload" })
    public async create(@Body() payload: AddParcelDto) {
        try {
            return await this.parcelService.add(payload);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                if (error.driverError?.message?.includes("duplicate key")) {
                    throw new HttpException(
                        "Duplicate SKU not allowed",
                        HttpStatus.BAD_REQUEST,
                        {
                            cause: error,
                        }
                    );
                }
                throw new HttpException("Bad payload", HttpStatus.BAD_REQUEST, {
                    cause: error,
                });
            }

            throw error;
        }
    }
}
