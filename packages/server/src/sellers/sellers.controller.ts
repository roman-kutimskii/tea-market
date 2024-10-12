import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('sellers')
@ApiTags('sellers')
export class SellersController {
  constructor(private readonly sellersService: SellersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new seller' })
  @ApiResponse({
    status: 201,
    description: 'The seller has been successfully created.',
  })
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellersService.create(createSellerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sellers' })
  @ApiResponse({ status: 200, description: 'Return all sellers.' })
  findAll() {
    return this.sellersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a seller by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the seller to retrieve' })
  @ApiResponse({
    status: 200,
    description: 'Return the seller with the given ID.',
  })
  @ApiResponse({ status: 404, description: 'Seller not found.' })
  findOne(@Param('id') id: string) {
    return this.sellersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a seller by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the seller to update' })
  @ApiResponse({
    status: 200,
    description: 'The seller has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Seller not found.' })
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellersService.update(+id, updateSellerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a seller by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the seller to delete' })
  @ApiResponse({
    status: 200,
    description: 'The seller has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.sellersService.remove(+id);
  }
}
