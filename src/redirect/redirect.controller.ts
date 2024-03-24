import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { LinksService } from '../links/links.service';

@Controller()
export class RedirectController {
  constructor(private readonly linksService: LinksService) {}

  @Get('/:id')
  async handleRedirect(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const link = await this.linksService.getLink({ id });
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      await this.linksService.incrementVisitorCountById(id);
      return res.redirect(301, link.originalUrl);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).send('Link not found');
      } else {
        res.status(500).send('Internal Server Error');
      }
    }
  }
}
