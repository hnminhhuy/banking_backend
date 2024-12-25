import {
  BadGatewayException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateContactUsecase } from '../../core/usecases';
import { Route } from 'src/decorators';
import { ContactRoute } from '../routes/contact.route';
import { CreateContactDto } from '../dtos/contact.dto';
import { ContactModelParams } from '../../core/models/contact.model';

@ApiTags('Contact')
@Controller('api/customer/v1/contact')
export class ContactController {
  constructor(private readonly createContactUsecase: CreateContactUsecase) {}

  @Route(ContactRoute.createContact)
  async createContact(@Req() req, @Body() body: CreateContactDto) {
    const contactParams: ContactModelParams = {
      bankId: body.bankId,
      beneficiaryId: body.beneficiaryId,
      nickname: body.nickname,
    };
    try {
      const data = await this.createContactUsecase.execute(
        req.user.authId,
        contactParams,
      );

      return {
        data,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      // Handle specific errors from use case
      switch (error.message) {
        case 'UserNotFoundError':
          throw new NotFoundException('User not found');
        case 'ExternalBankError':
          throw new ForbiddenException(
            'Cannot create contact for external bank',
          );
        case 'BankAccountNotFoundError':
          throw new NotFoundException('Bank account for beneficiary not found');
        case 'CannotCreateContactForSelfError':
          throw new ConflictException('Cannot create contact for yourself.');
        default:
          throw new InternalServerErrorException(
            'An unexpected error occurred',
          );
      }
    }
  }
}
