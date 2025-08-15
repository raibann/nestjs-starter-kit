import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The current password',
    example: 'current_password',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: 'The new password',
    example: 'new_password123',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
