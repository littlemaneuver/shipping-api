import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Country {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true, length: 255 })
    public name: string;
}
