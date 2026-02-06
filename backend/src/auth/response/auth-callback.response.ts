import { ApiProperty } from '@nestjs/swagger';

class UserBasic {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

export class AuthCallbackResponse {
  @ApiProperty()
  sessionId: string;

  @ApiProperty()
  isNewUser: boolean;

  @ApiProperty({ type: UserBasic })
  user: UserBasic;
}
