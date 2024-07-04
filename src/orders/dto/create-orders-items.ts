import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { OrderItemDto } from './order-item.dto';
import { Type } from "class-transformer";

export class CreateOrdersItemsDto {

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested ( { each : true })
    @Type(() => OrderItemDto)
    items : OrderItemDto[];

}
