import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('link')
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  originalUrl: string;

  @Column({ unique: true, default: '' })
  shortUrl: string;

  @Column({ default: 0 })
  visitorCount: number;
}
