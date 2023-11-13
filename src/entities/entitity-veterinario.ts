import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('veterinarios')
@Unique(["crmv"])
export class EVeterinario {

    @PrimaryGeneratedColumn(({ name: 'vet_id' }))
    public id: number

    @Column(({ name: 'vet_nome' }))
    public nome: string

    @Column(({ name: 'vet_email' }))
    public email: string

    @Column(({ name: 'vet_crmv' }))
    public crmv: string

}

