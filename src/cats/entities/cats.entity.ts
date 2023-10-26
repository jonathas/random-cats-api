import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Ratings } from './ratings.entity';
import { Images } from './images.entity';

@Entity()
export class Cats {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  public id: number;

  @Column('varchar', { name: 'title', length: 255 })
  public title: string;

  @Column('varchar', { name: 'image_url', length: 255, comment: 'When providing a url, it should be saved here', nullable: true })
  public imageUrl: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @BeforeInsert()
  public insertCreated() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  public insertUpdated() {
    this.updatedAt = new Date();
  }

  @OneToMany(() => Ratings, (ratings) => ratings.cat)
  public ratings: Ratings[];

  @OneToMany(() => Images, (images) => images.cat)
  public images: Images[];
}
