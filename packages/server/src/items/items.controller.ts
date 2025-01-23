import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @ApiBearerAuth()
  @Roles(Role.Seller, Role.Admin)
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Public()
  @Get()
  @ApiQuery({ name: 'lastId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'filterBy', required: false })
  @ApiQuery({ name: 'filterValue', required: false })
  findAll(
    @Query('lastId') lastId?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
    @Query('filterBy') filterBy?: string,
    @Query('filterValue') filterValue?: string,
  ) {
    return this.itemsService.findAll(
      lastId,
      limit,
      sortBy,
      sortOrder,
      filterBy,
      filterValue,
    );
  }

  @Public()
  @Get('search')
  search(@Query('query') query: string) {
    return this.itemsService.search(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @ApiBearerAuth()
  @Roles(Role.Seller, Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @ApiBearerAuth()
  @Roles(Role.Seller, Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
