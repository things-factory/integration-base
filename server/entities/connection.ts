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

import { Connections } from '../engine'

@Entity()
@Index('ix_connection_0', (connection: Connection) => [connection.domain, connection.name], { unique: true })
export class Connection {
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

  @Column()
  type: string

  @Column()
  endpoint: string

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
  params: string

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

  async connect() {
    var connector = Connections.getConnector(this.type)
    var params = {}

    try {
      params = JSON.parse(this.params || '{}')
    } catch (ex) {
      console.error(`connection '${this.name}' params should be JSON format`, ex)
    }

    await connector.connect({
      ...this,
      params
    })

    this.status = 1
  }

  async disconnect() {
    try {
      var connector = Connections.getConnector(this.type)
      await connector.disconnect(this.name)
    } finally {
      this.status = 0
    }
  }
}
