import { Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity('usuarios')
export class EUsuario {

    @PrimaryGeneratedColumn(({ name: 'usu_id' }))
    public id: number

    @Column(({ name: 'usu_login' }))
    public login: string 

    @Column(({ name: 'usu_senha' }))
    public senha: string

}

