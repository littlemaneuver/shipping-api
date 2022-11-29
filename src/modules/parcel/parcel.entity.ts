import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from '../country/country.entity';

@Entity()
export class Parcel {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true, length: 64 })
    public sku: string;

    @Column({ type: 'text' })
    public description: string;

    @Column({ length: 255 })
    public streetAddress: string;

    @Column({ length: 255 })
    public town: string;

    @ManyToOne(() => Country, { createForeignKeyConstraints: false })
    public country: Country;

    @Column({ type: 'timestamp' })
    public deliveryDate: string;

}
