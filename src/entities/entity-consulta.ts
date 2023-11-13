import { Entity, Column, PrimaryGeneratedColumn, Unique, JoinColumn, ManyToOne } from "typeorm";
import { EVeterinario } from "./entitity-veterinario";
import { EAnimal } from "./entity-animal";

@Entity('consulta')
export class EConsulta {

    @PrimaryGeneratedColumn(({ name: 'con_id' }))
    public id: number

    @Column(({ name: 'con_remedio', default: ' ' }))
    public remedio: string

    @Column(({ name: 'con_data', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP()' }))
    public data: string
        
    @Column(({ name: 'con_diagnostico', default: ' ' }))
    public diagnostico: string

    @ManyToOne(() => EVeterinario)
    @JoinColumn({ name: 'con_vet_id' })
    public veterinario: EVeterinario

    @ManyToOne(() => EAnimal)
    @JoinColumn({ name: 'con_ani_id' })
    public animal: EAnimal


}

