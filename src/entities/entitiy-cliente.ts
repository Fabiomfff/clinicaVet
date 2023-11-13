import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('cliente')
@Unique(["email"])
export class ECliente {

    @PrimaryGeneratedColumn(({ name: 'cli_id' }))
    public id: number

    @Column(({ name: 'cli_nome' }))
    public nome: string

    @Column(({ name: 'cli_email' }))
    public email: string

    @Column(({ name: 'cli_telefone' }))
    public telefone: string

}

