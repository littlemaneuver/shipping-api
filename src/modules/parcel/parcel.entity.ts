import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
} from "typeorm";
import { Country } from "../country/country.entity";

@Entity()
export class Parcel {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true, length: 8 })
    public sku: string;

    @Column({ type: "text" })
    public description: string;

    @Column({ length: 255 })
    public streetAddress: string;

    @Column({ length: 255 })
    public town: string;

    @ManyToOne(() => Country, { createForeignKeyConstraints: false })
    @JoinColumn({ name: "countryId" })
    public country: Country;

    @Column()
    public countryId: number;

    @Column({ type: "timestamp" })
    public deliveryDate: string;
}
