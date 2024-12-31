import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountModule } from '../bank_account/bank_account.module';
import { BankModule } from '../bank/bank.module';
import { UserModule } from '../user/user.module';
import { IContactRepo } from './core/repositories/contact.irepo';
import { ContactRepo } from './infra/data/repositories/contact.repo';
import { ContactDatasource } from './infra/contact.datasource';
import {
  CreateContactUsecase,
  DeleteContactUsecase,
  GetContactUsecase,
  ListContactUsecase,
  UpdateContactUsecase,
} from './core/usecases';
import { ContactEntity } from './infra/data/entities/contact.entity';
import { ContactController } from './app/controller/contact.controller';
import { ExternalBankModule } from '../external-bank/external_bank.module';
import { GetAllContactInfoUsecase } from './core/usecases/get_all_contact_info.usecase';
import { ExternalBankModule } from '../external-bank/external_bank.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactEntity]),
    forwardRef(() => BankAccountModule),
    forwardRef(() => BankModule),
    forwardRef(() => UserModule),
    forwardRef(() => ExternalBankModule),
  ],
  controllers: [ContactController],
  providers: [
    {
      provide: IContactRepo,
      useClass: ContactRepo,
    },
    ContactDatasource,
    CreateContactUsecase,
    GetContactUsecase,
    GetAllContactInfoUsecase,
    ListContactUsecase,
    UpdateContactUsecase,
    DeleteContactUsecase,
  ],
})
export class ContactModule {}
