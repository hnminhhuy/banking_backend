import { Command, Console } from 'nestjs-console';
import { CreateUserUsecase } from '../../core/usecases';
import { CreateAdminDto } from '../dtos/create_admin.dto';
import { validate } from 'class-validator';
import { UserModelParams } from '../../core/models/user.model';
import { UserRole } from '../../core/enums/user_role';
import { Logger } from '@nestjs/common';

@Console()
export class CreateAdminCommand {
  private readonly logger = new Logger(CreateAdminCommand.name);

  constructor(private readonly createUserUsecase: CreateUserUsecase) {}

  @Command({
    command: 'admin:create',
    description: 'Create admin',
    options: [
      {
        flags: '-e --email <email>',
        required: true,
        description: 'Admin email',
      },

      {
        flags: '-fn --full-name <fullName>',
        required: true,
        description: 'Admin fullName',
      },
      {
        flags: '-p --password <password>',
        required: true,
        description: 'Admin password',
      },
      {
        flags: '-u --username <username>',
        required: true,
        description: 'Admin username',
      },
    ],
  })
  async createAdmin(options: CreateAdminDto): Promise<void> {
    const adminDto = new CreateAdminDto();
    adminDto.email = options.email.toLowerCase().trim();
    adminDto.fullName = options.fullName.toLowerCase().trim();
    adminDto.username = options.username.toLowerCase().trim();
    adminDto.password = options.password.toLowerCase().trim();

    const errors = await validate(adminDto);
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

    const userParams: UserModelParams = {
      password: adminDto.password,
      role: UserRole.Admin,
      isBlocked: false,
      fullName: adminDto.fullName,
      email: adminDto.email,
      username: adminDto.username,
      createdBy: undefined,
    };

    await this.createUserUsecase.execute(userParams);

    console.log('Create admin success');
  }
}
