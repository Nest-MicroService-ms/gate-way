import 'dotenv/config';
import * as joi from 'joi';
/* 
* Instalar 
* - npm i dotenv
* - npm i joi
* */

interface EnvVars {
    PORT             : number;
    NATS_SERVERS     : string[];
    //PRODUCTS_MS_PORT : number;
    //ORDERS_MS_HOST   : string;
    //ORDERS_MS_PORT   : number;
}

const envsSchema = joi.object({

    PORT             : joi.number().required(),
    NATS_SERVERS : joi.array().items( joi.string() ).required(),
    //PRODUCTS_MS_HOST : joi.string().required(),
    //PRODUCTS_MS_PORT : joi.number().required(),
    //ORDERS_MS_HOST   : joi.string().required(),
    //ORDERS_MS_PORT   : joi.number().required(),
})
.unknown(true) //! Acepta todas las propiedad, NO solo las validadas


const {error, value } = envsSchema.validate ({
    ...process.env,
    NATS_SERVERS : process.env.NATS_SERVERS?.split(',')
});

if ( error ) throw new Error(`Config Validation Error: ${ error.message }`);
  

const envVars: EnvVars = value;  

export const envs = {

    PORT             : envVars.PORT,
    NATS_SERVERS     : envVars.NATS_SERVERS
    //PRODUCTS_MS_HOST : envVars.PRODUCTS_MS_HOST,
    //PRODUCTS_MS_PORT : envVars.PRODUCTS_MS_PORT,
    //ORDERS_MS_HOST   : envVars.ORDERS_MS_HOST,
    //ORDERS_MS_PORT   : envVars.ORDERS_MS_PORT
}