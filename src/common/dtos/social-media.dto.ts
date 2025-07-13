import { IsString } from "class-validator";

export class SocilMedia {
    @IsString()
    platform: string;

    @IsString()
    url: string;
}