import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive, ValidateNested } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";
import { OrderItemDto } from './order-item.dto';
import { Type } from "class-transformer";

export class CreateOrdersDto {

    
    @IsNumber()
    @IsPositive()
    totalAmount : number;

    @IsNumber()
    @IsPositive()
    totalItems : number;

    @IsEnum(OrderStatusList,{
        message : `Possible Status Values Are ${OrderStatusList}`
    })
    @IsOptional()
    status : OrderStatus = OrderStatus.PENDING;

    @IsBoolean()
    @IsOptional()
    paid : boolean = false;
    
}
