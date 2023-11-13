import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { ECliente } from "./entitiy-cliente";
import { EEspecie } from "./entitity-especie";
import { EUsuario } from "./entitity-usuario";
import { Especie } from "../models/model-especie";
import { Cliente } from "../models/model-cliente";
import { Usuario } from "../models/model-usuarios";

@Entity('animal')
export class EAnimal {

    @PrimaryGeneratedColumn(({ name: 'ani_id' }))
    public id: number

    @Column(({ name: 'ani_nome', default: ' ' }))        
    public nome: string

    @Column(({ name: 'ani_nasc', default: ' ' }))
    public nasc: string

    @Column(({ name: 'ani_log_em', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }))
    public log_em: string

    @ManyToOne(() => EUsuario)
    @JoinColumn({ name: 'ani_log_user' })
    public usuario: EUsuario;

    @ManyToOne(() => EEspecie)
    @JoinColumn({ name: 'ani_esp_id' })
    public especie: EEspecie;

    @ManyToOne(() => ECliente)
    @JoinColumn({ name: 'ani_cli_id' })
    public dono: ECliente;


};
//lazy load

//instanciaanimalo.save; //active record

//mapperanimal.save(instanciaanimal) //data mapper

//migration <-> schema BD codigo->banco

