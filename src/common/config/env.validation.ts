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

export class SendgridConfig {
  @IsString({ message: 'SENDGRID_APIKEY must be a string' })
  APIKEY!: string;
}

export class MailerConfig {
  @IsString({ message: 'MAILER_EMAIL must be a string' })
  EMAIL!: string;
}

export class FirebaseConfig {
  @IsString({ message: 'FIREBASE_PROJECTID must be a string' })
  public readonly PROJECTID!: string;

  @IsString({ message: 'FIREBASE_PRIVATEKEY must be a string' })
  @Transform(({ value }) => value.replace(/\\n/gm, '\n'))
  public readonly PRIVATEKEY!: string;

  @IsString({ message: 'FIREBASE_EMAIL must be a string' })
  public readonly EMAIL!: string;
}

export class S3Config {
  @IsString({ message: 'S3_ACCESSKEY must be a string' })
  ACCESSKEY!: string;

  @IsString({ message: 'S3_SECRET must be a string' })
  SECRET!: string;

  @IsString({ message: 'S3_BUCKET must be a string' })
  BUCKET!: string;

  @IsString({ message: 'S3_REGION must be a string' })
  REGION!: string;
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

  @Type(() => SendgridConfig)
  @ValidateNested()
  public readonly SENDGRID!: SendgridConfig;

  @Type(() => MailerConfig)
  @ValidateNested()
  public readonly MAILER!: MailerConfig;

  @Type(() => FirebaseConfig)
  @ValidateNested()
  public readonly FIREBASE!: FirebaseConfig;

  @Type(() => S3Config)
  @ValidateNested()
  public readonly S3!: S3Config;
}
