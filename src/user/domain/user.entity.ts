import { Temperature } from 'src/temperature/domain/temperature.entity';
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm/index';

@Entity("tbl_user")
export class User {

    @PrimaryColumn()
    userId: string;


    @Column()
    password: string;


    @Column({ nullable: true })
    organization: string;


    @Column({ nullable: true })
    username: string;


    @Column({ nullable: true })
    nfcId: string;


    @Column({ default: true, nullable: true })
    isActive: boolean;


    @OneToMany(type => Temperature, temperature => temperature.user)
    temperatures: Array<Temperature>;

}