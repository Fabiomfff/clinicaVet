import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";
import { TipoEspecie } from "../models/model-especie";

@Entity('especie')
export class EEspecie {

    @PrimaryGeneratedColumn({ name: 'esp_id' })
    public id: number;

    @Column({ name: 'esp_tipo', type: 'enum', enum: TipoEspecie })
    public tipo: TipoEspecie;

    @Column({ name: 'esp_desc' })
    public desc: string;
}