import { ApiProperty } from '@nestjs/swagger';

class OnboardingUser {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  onboardComplete: boolean;
}

export class CompleteOnboardingResponse {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: OnboardingUser })
  user: OnboardingUser;
}

export class OnboardingStatusResponse {
  @ApiProperty()
  onboardComplete: boolean;

  @ApiProperty()
  needsBirthday: boolean;

  @ApiProperty()
  isTemporaryUser: boolean;

  @ApiProperty()
  hasPrefilledData: boolean;
}
