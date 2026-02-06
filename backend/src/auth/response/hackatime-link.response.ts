import { ApiProperty } from '@nestjs/swagger';

export class SendHackatimeLinkOtpResponse {
  @ApiProperty()
  message: string;
}

export class VerifyHackatimeLinkOtpResponse {
  @ApiProperty()
  message: string;

  @ApiProperty()
  hackatimeAccountId: number;
}
