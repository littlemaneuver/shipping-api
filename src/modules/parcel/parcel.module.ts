import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParcelController } from "./parcel.controller";
import { Parcel } from "./parcel.entity";
import { ParcelService } from "./parcel.service";

@Module({
    imports: [TypeOrmModule.forFeature([Parcel])],
    providers: [ParcelService],
    controllers: [ParcelController],
})
export class ParcelModule {}
