import { Controller, Get } from "@nestjs/common";
import {} from "express";
import { CountryService } from "./country.service";

@Controller("countries")
export class CountryController {
    constructor(private readonly parcelService: CountryService) {}

    @Get()
    public async findAll() {
        return this.parcelService.findAll();
    }
}
