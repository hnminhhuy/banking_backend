import {
  BadGatewayException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateContactUsecase,
  GetContactUsecase,
  ListContactUsecase,
} from '../../core/usecases';
import { Route } from 'src/decorators';
import { ContactRoute } from '../routes/contact.route';
import { CreateContactDto, GetContactDto } from '../dtos/contact.dto';
import { ContactModelParams } from '../../core/models/contact.model';
import { ListContactDto } from '../dtos/list_contact';
import { PageParams, SortParams } from 'src/common/models';
import { ContactSort } from '../../core/enums/contact_sort';

@ApiTags('Contact')
@Controller('api/customer/v1/contact')
export class ContactController {
  constructor(
    private readonly createContactUsecase: CreateContactUsecase,
    private readonly getContactUsecase: GetContactUsecase,
    private readonly listContactUsecase: ListContactUsecase,
  ) {}

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
  @Route(ContactRoute.getContact)
  async getDebt(@Param() param: GetContactDto) {
    const contact = await this.getContactUsecase.execute('id', param.id);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    return {
      contact,
      statusCode: 200,
    };
  }

  @Route(ContactRoute.listContact)
  async listContact(@Req() req, @Query() query: ListContactDto) {
    const pageParams = new PageParams(
      query.page,
      query.limit,
      query.needTotalCount,
      query.onlyCount,
    );

    const sortParams: SortParams<ContactSort> = new SortParams(
      (query.sort as ContactSort) ?? ContactSort.CREATED_AT,
      query.direction,
    );

    const pageResult = await this.listContactUsecase.execute(
      req.user.authId,
      pageParams,
      sortParams,
    );

    const data = pageResult.data.map(
      ({ id, userId, ...returnedData }) => returnedData,
    );

    return {
      data: data,
      metadata: {
        page: pageResult.page,
        totalCount: pageResult.totalCount,
      },
    };
  }
}
