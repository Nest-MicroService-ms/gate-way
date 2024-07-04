import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom,catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from '../config/';

import { CreateProductDto, UpdateProductDto } from './domain';

/*
    * Link
    * - https://docs.nestjs.com/microservices/basics
    * - https://rxjs.dev/api/index/function/firstValueFrom
    * - https://rxjs.dev/guide/overview
    * - https://rxjs.dev/api
    * - https://docs.nestjs.com/microservices/exception-filters
    * 
    * NOTA IMPO : "Observable" : no es mas que un flujo de informacion (son la fuente de informacion) 
    * emit      : Es un Observable(sync) no espera nada y la funcion devuelve nada ( void())  
    * send      : Es un Observable(async) que se puede manejar como promsesa que espera una 
    * accion, retorna algun valor o exception  
    * NOTA-IMP  : El argumento de send o emit debe ser igual al decorador "MessagePattern" del 
    * controlador del MS "@MessagePattern({ cmd : 'getAllProducts'})"
    * connect   :
    * close     : 
    * 
    */

@Controller('products')
export class ProductsController {

  constructor(
    //Injecta el Micro-Servicio de Products
    @Inject(NATS_SERVICE) 
    private readonly client:ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto : CreateProductDto) {

    return this.client.send( { cmd : 'createProduct'},createProductDto)
    .pipe(
      catchError( error => { throw new RpcException(error) } ) 
    );

  }

  @Get()
  async getAllProducts(@Query() paginationDto : PaginationDto) {

     
    return this.client.send({ cmd : 'getAllProducts'},paginationDto);
  }
  @Get('/:id')
  async getProductById(@Param('id',ParseIntPipe) id: number) {

    /*
      * FirstValueFrom : Es una funcion de rxjs(RX) que se puede manejrar como una Promsesa que 
      * espera un observable como argumento,esto lanza el Subscribers o los operadores y espera 
      * el primer valor que el Observable (send) va a emitir
      */

    /*
    * ********************* OPCION CON PROMESA CONSUME MS ************************************************
    * try { return await firstValueFrom(this.productsClient.send({ cmd : 'getProductById'}, { id } ) ); }
    * catch(error) { throw new RpcException(error) }
    * ****************************************************************************************************
    */

    /*
    *  ********************* OPCION CON OBSERVABLE CONSUME MS ****************************************
    */

    return this.client.send( {cmd : 'getProductById'}, { id })
           .pipe(
              catchError( error => { throw new RpcException(error) } )
           );

  }

  @Patch(':id')
  updateProduct(@Param('id',ParseIntPipe) id: number, @Body() updateProductDto : UpdateProductDto) {


    this.getProductById ( id );

    
    return this.client.send( { cmd : 'updateProduct'}, { id, ...updateProductDto } )
          .pipe(
              catchError( error => { throw new RpcException(error) } )
          );
  }

  @Delete(':id')
  deleteProduct(@Param('id',ParseIntPipe) id: number) {
    
    this.getProductById ( id );

    return this.client.send( { cmd : 'deleteProduct'}, { id } )
          .pipe(
              catchError( error => { throw new RpcException(error) } )
          );
  }

}

