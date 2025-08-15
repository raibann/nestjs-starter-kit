import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'The name of the permission',
    example: 'create_user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The description of the permission',
    example: 'Create a new user',
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
