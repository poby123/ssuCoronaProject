import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Temperature } from './domain/temperature.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Temperature])],
    controllers: [],
    providers: [],
    exports: []
  })
  export class TemperatureModule { }
