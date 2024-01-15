import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Environment } from '../constants/environment.enum';

export class NodeConfig {
  @IsEnum(Environment, {
    message: `NODE_ENV must be one of the following values: ${Object.values(
      Environment,
    )}`,
  })
  public readonly ENV!: Environment;
}

export class ProjectConfig {
  @IsString({ message: 'PROJECT_NAME must be a string' })
  public readonly NAME!: string;

  @IsString({ message: 'PROJECT_DESCRIPTION must be a string' })
  public readonly DESCRIPTION!: string;

  @IsString({ message: 'PROJECT_VERSION must be a string' })
  public readonly VERSION!: string;
}

export class SwaggerConfig {
  @IsString({ message: 'SWAGGER_USERNAME must be a string' })
  public readonly USERNAME!: string;

  @IsString({ message: 'SWAGGER_PASSWORD must be a string' })
  public readonly PASSWORD!: string;
}

export class AppConfig {
  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'PORT must be a number' },
  )
  public readonly PORT!: number;

  @Type(() => NodeConfig)
  @ValidateNested()
  public readonly NODE!: NodeConfig;

  @Transform(({ value }) => Boolean(value))
  @IsBoolean()
  public readonly CLUSTERING!: boolean;
}

export class RootConfig {
  @Type(() => AppConfig)
  @ValidateNested()
  public readonly APP!: AppConfig;

  @Type(() => ProjectConfig)
  @ValidateNested()
  public readonly PROJECT!: ProjectConfig;

  @Type(() => SwaggerConfig)
  @ValidateNested()
  public readonly SWAGGER!: SwaggerConfig;
}
