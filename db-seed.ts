import { DataSource } from "typeorm";
import { faker } from "@faker-js/faker";
import { Country } from "./src/modules/country/country.entity";
import { Parcel } from "./src/modules/parcel/parcel.entity";

const countryNameList = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas (the)",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia (Plurinational State of)",
    "Bonaire, Sint Eustatius and Saba",
    "Bosnia and Herzegovina",
    "Curaçao",
    "Cyprus",
    "Czechia",
    "Côte d'Ivoire",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic (the)",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Falkland Islands (the) [Malvinas]",
    "Faroe Islands (the)",
    "Fiji",
    "Finland",
    "France",
];

const ds = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "admin",
    password: "admin",
    database: "shipping",
    entities: [Country, Parcel],
});

async function apply() {
    await ds.initialize();
    const countryRepo = ds.manager.getRepository(Country);
    const parcelRepo = ds.manager.getRepository(Parcel);
    const countries: Country[] = [];

    await countryRepo.clear();
    await parcelRepo.clear();

    // init countries data
    for (const countryName of countryNameList) {
        const country = new Country();
        country.name = countryName;

        const savedCountry = await countryRepo.save(country);
        countries.push(savedCountry);
    }

    // init parcels data
    const parcels = [...Array(1000)].map((_, i) => {
        const parcel = new Parcel();
        parcel.sku = faker.random.alphaNumeric(8, { casing: "upper" });
        parcel.description = faker.lorem.words(5);
        parcel.country = countries[i % countries.length];
        parcel.deliveryDate = faker.date.future().toISOString();
        parcel.streetAddress = faker.address.streetAddress();
        parcel.town = faker.address.cityName();

        return parcel;
    });

    await parcelRepo
        .createQueryBuilder()
        .insert()
        .into(Parcel)
        .values(parcels)
        .execute();
}

apply();
