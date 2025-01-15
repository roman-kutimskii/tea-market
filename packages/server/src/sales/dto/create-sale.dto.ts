import { Type } from 'class-transformer';
import { IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';

class SaleItemDto {
  @IsInt()
  @IsPositive()
  itemId: number;

  @IsInt()
  @IsPositive()
  quantity: number;
}

export class CreateSaleDto {
  @IsInt()
  @IsPositive()
  sellerId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];
}
