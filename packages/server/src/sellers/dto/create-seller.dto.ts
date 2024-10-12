import { ApiProperty } from '@nestjs/swagger';

export class CreateSellerDto {
  @ApiProperty({ description: 'Surname of the seller', example: 'Doe' })
  surname: string;

  @ApiProperty({
    description: 'Password for the seller account',
    example: 'password',
  })
  password: string;
}
