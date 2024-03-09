import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
@Controller()
export default class AppController {
  @Get('.well-known/pki-validation/CACCD383921144021879B02C34E6D491.txt')
  public async pkiValidation(@Res() res: Response) {
    const content =
      '80072C9AEE9AEB1A3E1913550F5DFBBBD6A145DCDB9DA9E5F2445A058962A541\n' +
      'comodoca.com\n' +
      '9e951994a712ef3';
    res.type('text/plain');
    res.send(content);
  }
}
