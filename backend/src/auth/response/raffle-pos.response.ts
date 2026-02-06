import { ApiProperty } from '@nestjs/swagger';

export class RafflePosResponse {
  @ApiProperty({ nullable: true })
  rafflePos: string | null;
}
