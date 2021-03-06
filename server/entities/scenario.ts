import {
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  Index,
  Column,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { Domain } from '@things-factory/shell'
import { User } from '@things-factory/auth-base'
import { Step } from './step'

import { ScenarioEngine } from '../engine'

@Entity()
@Index('ix_scenario_0', (scenario: Scenario) => [scenario.domain, scenario.name], { unique: true })
export class Scenario {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column()
  name: string

  @Column({
    nullable: true
  })
  description: string

  @Column({
    nullable: true
  })
  active: boolean

  @Column({
    nullable: true
  })
  status: number

  @Column({
    nullable: true
  })
  schedule: string

  @Column({
    nullable: true
  })
  timezone: string

  @OneToMany(
    type => Step,
    step => step.scenario
  )
  steps: Step[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(type => User, {
    nullable: true
  })
  creator: User

  @ManyToOne(type => User, {
    nullable: true
  })
  updater: User

  async start(instanceName, variables?: any) {
    try {
      await ScenarioEngine.load(instanceName || this.name, this, { variables })
      this.status = 1
    } catch (ex) {
      this.status = 0
    }
  }

  async stop(instanceName?) {
    try {
      await ScenarioEngine.unload(instanceName || this.name)
    } finally {
      this.status = 0
    }
  }
}
