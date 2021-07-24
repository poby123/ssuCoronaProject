import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm/index';

@Entity("tbl_user")
export class User {

    @PrimaryColumn()
    userId: string;
    
    @Column()
    password: string;
    
    @Column({ default: true, nullable:true })
    isActive: boolean;
}