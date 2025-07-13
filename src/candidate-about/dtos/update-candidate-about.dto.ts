import { PartialType } from "@nestjs/mapped-types";
import { CreateCandidateAboutDto } from "./create-candidate-about.dto";

export class UpdateCandidateAboutDto extends PartialType(CreateCandidateAboutDto) {

}