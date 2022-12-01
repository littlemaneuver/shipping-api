import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Country } from "./country.entity";

@Injectable()
export class CountryService {
    constructor(
        @InjectRepository(Country)
        private readonly countriesRepository: Repository<Country>
    ) {}

    public async findAll(): Promise<Country[]> {
        return this.countriesRepository.find();
    }

    public async findOne(id: number): Promise<Country | null> {
        return this.countriesRepository.findOneBy({ id });
    }

    public async remove(id: string): Promise<void> {
        await this.countriesRepository.delete(id);
    }
}
