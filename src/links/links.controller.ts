import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { GetLinkDto } from './dto/get-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { Link } from './entities/link.entity';
import { LinksService } from './links.service';

@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get('/:id')
  getLink(@Param() getLinkDto: GetLinkDto): Promise<Link> {
    const link = this.linksService.getLink(getLinkDto);

    if (!link) {
      throw new NotFoundException();
    }

    return link;
  }

  @Post()
  createLink(@Body() createLinkDto: CreateLinkDto): Promise<Link> {
    return this.linksService.createLink(createLinkDto);
  }

  @Delete('/:id')
  deleteLink(@Param() getLinkDto: GetLinkDto): Promise<void> {
    const deleteRes = this.linksService.deleteLink(getLinkDto);

    if (!deleteRes) {
      throw new NotFoundException();
    }

    return deleteRes;
  }

  @Put('/:id')
  updateLink(
    @Param() getLinkDto: GetLinkDto,
    @Body() updateLinkDto: UpdateLinkDto,
  ): Promise<Link> {
    const result = this.linksService.updateLink(getLinkDto, updateLinkDto);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }
}
