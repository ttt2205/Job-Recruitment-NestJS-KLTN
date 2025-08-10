import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString, Matches } from "class-validator";

export class JobWorkTime {

    @IsString()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)/, {
        message: 'from must be a valid time in HH:mm format',
    })
    from: string;

    @IsString()
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)/, {
        message: 'from must be a valid time in HH:mm format',
    })
    to: string;   
}