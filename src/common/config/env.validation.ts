import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  Max,
  Min,
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

export class DatabaseConfig {
  @IsString({ message: 'DATABASE_HOST must be a string' })
  public readonly HOST!: string;

  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'DATABASE_PORT must be a number' },
  )
  public readonly PORT!: number;

  @IsString({ message: 'DATABASE_USERNAME must be a string' })
  public readonly USERNAME!: string;

  @IsString({ message: 'DATABASE_PASSWORD must be a string' })
  public readonly PASSWORD!: string;

  @IsString({ message: 'DATABASE_NAME must be a string' })
  public readonly NAME!: string;

  @IsString({ message: 'DATABASE_SCHEMA must be a string' })
  public readonly SCHEMA!: string;

  @Transform(({ value }) => value === 'true')
  @IsBoolean({ message: 'DATABASE_SSL must be a boolean' })
  public readonly SSL!: boolean;
}

export class LLMGeminiMaxOutputConfig {
  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'LLM_GEMINI_MAX_OUTPUT_TOKENS must be a number' },
  )
  @Min(64)
  @Max(4096)
  public readonly TOKENS!: number;
}

export class LLMGeminiMaxConfig {
  @Type(() => LLMGeminiMaxOutputConfig)
  @ValidateNested()
  public readonly OUTPUT!: LLMGeminiMaxOutputConfig;
}

export class LLMGeminiConfig {
  @IsString({ message: 'LLM_GEMINI_API_BASE_URL must be a string' })
  public readonly API_BASE_URL!: string;

  @IsString({ message: 'LLM_GEMINI_API_KEY must be a string' })
  public readonly API_KEY!: string;

  @IsString({ message: 'LLM_GEMINI_MODEL must be a string' })
  public readonly MODEL!: string;

  @Transform(({ value }) => Number(value))
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'LLM_GEMINI_TEMPERATURE must be a number' },
  )
  @Min(0)
  @Max(1)
  public readonly TEMPERATURE!: number;

  @Type(() => LLMGeminiMaxConfig)
  @ValidateNested()
  public readonly MAX!: LLMGeminiMaxConfig;
}

export class LLMConfig {
  @Type(() => LLMGeminiConfig)
  @ValidateNested()
  public readonly GEMINI!: LLMGeminiConfig;
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

  @Type(() => DatabaseConfig)
  @ValidateNested()
  public readonly DATABASE!: DatabaseConfig;

  @Type(() => LLMConfig)
  @ValidateNested()
  public readonly LLM!: LLMConfig;
}
