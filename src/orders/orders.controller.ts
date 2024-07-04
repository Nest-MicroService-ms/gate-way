import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

import { CreateOrdersDto,OrderPaginationDto, StatusDto,CreateOrdersItemsDto } from './';
import { NATS_SERVICE } from 'src/config';
import { PaginationDto } from 'src/common';



@Controller('orders')
export class OrdersController {

  constructor(
    @Inject(NATS_SERVICE) 
    private readonly client: ClientProxy) {}

  @Post('')
  createOrder(@Body() createOrdersDto: CreateOrdersDto) {
    return this.client.send( { cmd : 'createOrders' },createOrdersDto)
  }

  @Post('items')
  createOrderItem(@Body() createOrdersItemsDto: CreateOrdersItemsDto) {
    return this.client.send( { cmd : 'createOrdersItems' },createOrdersItemsDto)
 }

  @Get()
  findAll(@Query() orderPaginationDto : OrderPaginationDto ) {
    return this.client.send( { cmd : 'findAllOrders' }, orderPaginationDto )
  
  }

  @Get('id/:id')
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    
    return this.client.send( { cmd : 'findOneOrder' },{id})
    .pipe(
      catchError( error => { throw new RpcException(error) } ) 
    );
    
  }

  @Get('idItem/:id')
  findOneItem(@Param('id',ParseUUIDPipe) id: string) {
    
    return this.client.send( { cmd : 'findOneOrderItem' },{id})
    .pipe(
      catchError( error => { throw new RpcException(error) } ) 
    );
    
  }

  @Get(':status')
  findAllByStatus(@Param('status') status: StatusDto,@Query() paginationDto:PaginationDto) {
    
    return this.client.send( { cmd : 'findAllOrders' },{
      status: status.status,
      ...paginationDto
    }).pipe(
      catchError( error => { throw new RpcException(error) } ) 
    );
    
  }

  @Patch(':id')
  updateOrderStatus(@Param('id',ParseUUIDPipe) id: string,@Body() statusDto : StatusDto) {

    return this.client.send( { cmd : 'changeOrderStatus' }, {
      id,
      status: statusDto.status
    })
    .pipe(
      catchError( error => { throw new RpcException(error) } ) 
    );
    
  }

}
