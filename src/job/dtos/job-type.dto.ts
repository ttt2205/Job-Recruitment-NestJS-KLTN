import { IsString } from "class-validator";

export class JobType {

    @IsString()
    styleClass: string; // default "time", "privacy", "required"

    @IsString()
    type: string;
}