import { Entity, Column, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('usuarios')
export class ELogin {

    @PrimaryGeneratedColumn(({ name: 'usu_id' }))
    public id: number

    @Column(({ name: 'usu_login' }))
    public login: string

    @Column(({ name: 'usu_senha' }))
    public senha: string

}


