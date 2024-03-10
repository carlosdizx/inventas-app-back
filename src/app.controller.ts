import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
@Controller()
export default class AppController {
  @Get('.well-known/pki-validation/61F1833FF64B35DB1772ED8770423EF6.txt')
  public async pkiValidation(@Res() res: Response) {
    const content =
      '852D09B7668BD4EE736848C772C46614E7934A4B93E466322A69CE8ACB569A3E\n' +
      'comodoca.com\n' +
      '9aab2d8bc400da9';
    res.type('text/plain');
    res.send(content);
  }
}
