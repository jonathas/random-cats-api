import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Cats } from './cats.entity';

@Entity()
export class Ratings {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column('int', { name: 'rating', default: 0 })
  public rating: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column('int', { name: 'cat_id' })
  public catId: number;

  @BeforeInsert()
  public insertCreated() {
    this.createdAt = new Date();
  }

  @ManyToOne(() => Cats, (cats) => cats.ratings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn([{ name: 'cat_id', referencedColumnName: 'id' }])
  public cat: Cats;
}
