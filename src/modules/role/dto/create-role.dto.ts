import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The description of the role',
    example: 'Administrator role with full access',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'List of permissions associated with the role',
    example: [{ id: '1' }, { id: '2' }],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}

class PermissionDto {
  @ApiProperty({
    description: 'The id of the permission',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
