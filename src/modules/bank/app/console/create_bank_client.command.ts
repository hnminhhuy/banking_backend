import { ConfigService } from '@nestjs/config';
import { Command, Console } from 'nestjs-console';
import * as cryptoJs from 'crypto-js';
import { CreateBankUsecase } from '../../core/usecases';
import { CreateBankDto } from '../dto';
import { validate } from 'class-validator';
import { Logger } from '@nestjs/common';
import { BankModelParams } from '../../core/models/bank.model';

@Console()
export class CreateAuthClientCommand {
  private readonly logger = new Logger(CreateAuthClientCommand.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly createBankUsecase: CreateBankUsecase,
  ) {}

  @Command({
    command: 'bank-client:create',
    description: 'Create client service',
    options: [
      {
        flags: '-c --code <code>',
        required: true,
        description: 'Bank code',
      },
      {
        flags: '-n --name <name>',
        required: true,
        description: 'Bank name',
      },
      {
        flags: '-sn --short-name <shortName>',
        required: true,
        description: 'Bank short name',
      },
      {
        flags: '-lg --logo-url <logoUrl>',
        required: true,
        description: 'Bank logo url',
      },
      {
        flags: '-pk --public-key <publicKey>',
        required: true,
        description: 'Bank public key',
      },
    ],
  })
  async createClient(options: CreateBankDto): Promise<void> {
    const bankDto = new CreateBankDto();
    bankDto.code = options.code.trim();
    bankDto.logoUrl = options.logoUrl.trim();
    bankDto.name = options.name.trim();
    bankDto.publicKey = options.publicKey.trim();
    bankDto.shortName = options.shortName.trim();

    const errors = await validate(bankDto);
    if (errors.length > 0) {
      this.logger.error('Validation errors occurred while creating an admin:');
      errors.forEach((error) => {
        const messages = error.constraints;
        for (const key in messages) {
          this.logger.error(` - ${messages[key]}`);
        }
      });
      return;
    }

    const bankParams: BankModelParams = {
      code: bankDto.code,
      name: bankDto.name,
      shortName: bankDto.shortName,
      publicKey: bankDto.publicKey,
      logoUrl: bankDto.logoUrl,
    };

    const bank = await this.createBankUsecase.execute(bankParams);

    const clientSecret = cryptoJs
      .HmacSHA512(bank.id, this.configService.get<string>('auth.hashKey'))
      .toString();

    console.log('=============================');
    console.log('client_id: ' + bank.id);
    console.log('client_secret: ' + clientSecret);
  }
}
