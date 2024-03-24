import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { CreateLinkDto } from './dto/create-link.dto';
import { GetLinkDto } from './dto/get-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { Link } from './entities/link.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private readonly linksRepository: Repository<Link>,
  ) {}

  async getAllLinks(param: GetLinkDto): Promise<Link[]> {
    return this.linksRepository.find({
      where: param,
    });
  }

  async createLink(createLinkDto: CreateLinkDto): Promise<Link> {
    const link = await this.linksRepository.findOne({
      originalUrl: createLinkDto.originalUrl,
    });

    if (link) {
      return link;
    }

    const newLink = await this.linksRepository.save(createLinkDto);
    await this.linksRepository.update(
      { id: newLink.id },
      { shortUrl: process.env.BASE_URL + newLink.id },
    );

    return {
      ...newLink,
      shortUrl: process.env.BASE_URL + newLink.id,
    };
  }

  async getLink(conditions: FindConditions<Link>): Promise<Link | null> {
    const link = await this.linksRepository.findOne(conditions);

    if (!link) {
      return null;
    }

    return link;
  }

  async deleteLink(getLinkDto: GetLinkDto): Promise<void | null> {
    const { id } = getLinkDto;
    const res = await this.linksRepository.delete({ id });

    if (res.affected === 0) {
      return null;
    }
  }

  async updateLink(
    getLinkDto: GetLinkDto,
    updateLinkDto: UpdateLinkDto,
  ): Promise<Link> {
    const { id } = getLinkDto;
    const link = await this.getLink({ id });

    if (!link) {
      return null;
    }

    const { originalUrl, shortUrl } = updateLinkDto;

    await this.linksRepository.save({
      ...link,
      originalUrl: originalUrl,
      shortUrl: shortUrl,
    });

    return link;
  }

  async incrementVisitorCountById(id: string): Promise<void> {
    await this.linksRepository.increment({ id }, 'visitorCount', 1);
  }
}
