import { ApiProperty } from '@nestjs/swagger';

export class AuthUrlResponse {
  @ApiProperty({ description: 'HCA OAuth authorization URL' })
  url: string;
}
