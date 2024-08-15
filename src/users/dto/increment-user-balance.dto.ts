import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class IncrementUserBalanceRequestDto {
  @IsNumber({}, { message: 'Increment must be a number' })
  @IsInt({ message: 'Increment must be an integer' })
  @IsPositive({ message: 'Increment must be greater than 0' })
  increment: number;
}
