import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { EConsulta } from "./entity-consulta";
import { EAnimal } from "./entity-animal";

@Entity('animais_consulta')
export class EAniCon {

    @PrimaryGeneratedColumn(({ name: 'anc_id' }))
    public id: number;

    @ManyToOne(() => EConsulta)
    @JoinColumn({ name: 'anc_con_id' })
    public consulta: EConsulta;

    @ManyToOne(() => EAnimal)
    @JoinColumn({ name: 'anc_ani_id' })
    public animal: EAnimal;

};