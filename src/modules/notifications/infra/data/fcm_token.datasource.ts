import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FcmTokenEntity } from './entities/fcm_token.entity';
import { Repository } from 'typeorm';
import { FcmTokenModel } from '../../core/models/fcm_token.model';

@Injectable()
export class FcmTokenDatasource {
  constructor(
    @InjectRepository(FcmTokenEntity)
    private readonly fcmTokenRepository: Repository<FcmTokenEntity>,
  ) {}

  async create(fcmToken: FcmTokenModel): Promise<void> {
    const newFcmToken = this.fcmTokenRepository.create(fcmToken);
    await this.fcmTokenRepository.insert(newFcmToken);
  }

  async deleteByToken(token: string): Promise<void> {
    await this.fcmTokenRepository.delete({ token });
  }

  async findAllByUserId(userId: string): Promise<FcmTokenModel[]> {
    const fcmTokens = await this.fcmTokenRepository.find({
      where: { userId: userId },
    });

    return fcmTokens.map((fcmToken) => new FcmTokenModel(fcmToken));
  }
}
