import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseModel {
  @ApiProperty({
    description: 'Access token issued after successful login',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The type of token issued, usually "Bearer"',
    example: 'Bearer',
  })
  tokenType: string;

  @ApiProperty({
    description: 'The time when the access token will expire',
    example: '2025-01-01T12:00:00.000Z',
  })
  accessTokenExpiresAt: Date;
}

export class RefreshAccessTokenResponseModel {
  @ApiProperty({
    description: 'New access token after refreshing the old one',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}

export class RequestPasswordResetResponseModel {
  @ApiProperty({
    description: 'User ID associated with the password reset request',
    example: 'string',
  })
  userId: string;

  @ApiProperty({
    description:
      "Message indicating that an OTP has been sent to the user's email",
    example: 'OTP sent to your email',
  })
  message: string;
}

export class VerifyOtpResponseModel {
  @ApiProperty({
    description: 'The reset token generated after OTP verification',
    example: 'abcdef1234567890',
  })
  resetToken: string;
}
