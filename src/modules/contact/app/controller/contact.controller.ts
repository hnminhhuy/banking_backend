import {
  BadRequestException,
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
  DeleteContactUsecase,
  GetContactUsecase,
  ListContactUsecase,
  UpdateContactUsecase,
} from '../../core/usecases';
import { Route } from 'src/decorators';
import { ContactRoute } from '../routes/contact.route';
import {
  CreateContactDto,
  GetContactDto,
  UpdateContactDto,
} from '../dtos/contact.dto';
import { ContactModelParams } from '../../core/models/contact.model';
import { ListContactDto } from '../dtos/list_contact';
import { PageParams, SortParams } from 'src/common/models';
import { ContactSort } from '../../core/enums/contact_sort';
import { GetAllContactInfoUsecase } from '../../core/usecases/get_all_contact_info.usecase';

@ApiTags('Contact')
@Controller('api/customer/v1/contact')
export class ContactController {
  constructor(
    private readonly createContactUsecase: CreateContactUsecase,
    private readonly getContactUsecase: GetContactUsecase,
    private readonly getAllContactInfoUsecase: GetAllContactInfoUsecase,
    private readonly listContactUsecase: ListContactUsecase,
    private readonly updateContactUsecase: UpdateContactUsecase,
    private readonly deleteContactUsecase: DeleteContactUsecase,
  ) {}

  @Route(ContactRoute.createContact)
  async createContact(@Req() req, @Body() body: CreateContactDto) {
    const contactParams: ContactModelParams = {
      bankId: body.bankId,
      beneficiaryId: body.beneficiaryId,
      nickname: body.nickname,
    };
    try {
      const existingContacts = await this.getAllContactInfoUsecase.execute(
        req.user.authId,
      );
      const isConflict = existingContacts?.find(
        (contact) => contact.beneficiaryId === contactParams.beneficiaryId,
      );
      if (isConflict) throw new Error('ExistingContactError');

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
        case 'ExistingContactError':
          throw new ConflictException('The contact has already existed.');
        default:
          throw new InternalServerErrorException(
            'An unexpected error occurred',
          );
      }
    }
  }
  @Route(ContactRoute.getContact)
  async getContact(@Req() req, @Param() param: GetContactDto) {
    const contact = await this.getContactUsecase.execute('id', param.id);
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    if (req.user.authId !== contact.userId)
      throw new ForbiddenException(
        'You are not authorized to get this contact',
      );
    return {
      contact,
      statusCode: 200,
    };
  }

  @Route(ContactRoute.getAllContact)
  async getAllContact(@Req() req) {
    const contacts = await this.getAllContactInfoUsecase.execute(
      req.user.authId,
    );
    if (!contacts) {
      throw new NotFoundException('Contact not found');
    }
    return {
      contacts,
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
      ({ userId, ...returnedData }) => returnedData,
    );

    return {
      data: data,
      metadata: {
        page: pageResult.page,
        totalCount: pageResult.totalCount,
      },
    };
  }

  @Route(ContactRoute.updateContact)
  async updateContact(
    @Req() req,
    @Param() params: GetContactDto,
    @Body() body: UpdateContactDto,
  ) {
    try {
      const result = await this.updateContactUsecase.execute(
        body.code,
        req.user.authId,
        params.id,
        body,
      );

      if (!result) {
        throw new InternalServerErrorException('Failed to update contact');
      }

      return {
        result,
      };
    } catch (error) {
      console.log(error);
      switch (error.message) {
        case 'NotFoundContactError':
          throw new NotFoundException('Contact not found');
        case 'ContactNotBelongToUser':
          throw new ForbiddenException(
            'You are not authorized to update this contact',
          );
        case 'BankAccountNotFoundError':
          throw new NotFoundException('Bank account not found for beneficiary');
        case 'InvalidFirldError':
          throw new BadRequestException('No valid fields provided for update');
        default:
          throw new InternalServerErrorException(
            'An unexpected error occurred',
          );
      }
    }
  }

  @Route(ContactRoute.deleteContact)
  async deleteContact(@Req() req, @Param() params: GetContactDto) {
    try {
      const result = await this.deleteContactUsecase.execute(
        req.user.authId,
        params.id,
      );

      if (!result) {
        throw new InternalServerErrorException('Failed to delete contact');
      }

      return {
        result,
      };
    } catch (error) {
      switch (error.message) {
        case 'NotFoundContactError':
          throw new NotFoundException('Contact not found');
        case 'ContactNotBelongToUser':
          throw new ForbiddenException(
            'You are not authorized to delete this contact',
          );
        default:
          throw new InternalServerErrorException(
            'An unexpected error occurred',
          );
      }
    }
  }
}
