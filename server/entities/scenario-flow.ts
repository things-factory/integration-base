import { Domain } from '@things-factory/shell'
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity('scenario_flows')
@Index('ix_scenario_flows_0', (scenarioFlow: ScenarioFlow) => [scenarioFlow.domain], { unique: true })
export class ScenarioFlow {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(type => Domain)
  domain: Domain

  @Column({
    nullable: true
  })
  flow: string
}
