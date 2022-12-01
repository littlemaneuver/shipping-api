import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParcelModule } from "./parcel/parcel.module";
import { CountryModule } from "./country/country.module";
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DB_SERVICE_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PWD,
            database: process.env.DB_NAME,
            synchronize: true,
            autoLoadEntities: true,
            migrationsRun: true,
            migrations: ["src/migration/**/*.ts"],
        }),
        ParcelModule,
        CountryModule,
    ],
})
export class ApplicationModule {}
