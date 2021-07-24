import { User } from 'src/user/domain/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm/index';

@Entity("tbl_temp")
export class Temperature {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(type => User, user => user.temperatures)
    user: User;

    @CreateDateColumn({ type: 'timestamp' })
    recordAt: Date;

    @Column()
    temperature: string;
}