import { IsIn, IsString } from "class-validator";

export class SocilMedia {
    @IsString()
    @IsIn(['facebook', 'twitter', 'instagram', 'linkedin', 'github', 'googlePlus'])
    platform: string;

    @IsString()
    url: string;
}