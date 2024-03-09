import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
@Controller()
export default class AppController {
  @Get('.well-known/pki-validation/CACCD383921144021879B02C34E6D491.txt')
  public async pkiValidation(@Res() res: Response) {
    const content =
      'D48537CF6B81492C23B9990FF99F354F7644F77F50539BC2E0A1A7B50A7A46E2\ncomodoca.com\nc4c13f7625572e0';
    res.type('text/plain');
    res.send(content);
  }
}
