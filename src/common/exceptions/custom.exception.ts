/**
 * Custom exception classes for project-specific exceptions.
 * TODO Replace the "ProjectAbbrv" with your project's name.
 */

import { ExceptionName } from './custom.exception.enum';
import { ICustomExceptionInfo } from './exception-info.interface';
import { getException } from './metadata.exception';

export abstract class ProjectAbbrvException extends Error {
  public exceptionName: ExceptionName;
  public exceptionInfo: ICustomExceptionInfo;

  constructor(exceptionName: ExceptionName, message: string) {
    super();
    this.exceptionName = exceptionName;
    this.exceptionInfo = getException(exceptionName);
    this.exceptionInfo.detail = message;
  }

  public toString = (): string => {
    return `${this.exceptionName} exception:\n${this.exceptionInfo}`;
  };
}

export class ProjectAbbrvNotFoundException extends ProjectAbbrvException {
  constructor(message: string) {
    super(ExceptionName.NOT_FOUND, message);
  }
}

export class ProjectAbbrvConflictException extends ProjectAbbrvException {
  constructor(message: string) {
    super(ExceptionName.CONFLICT, message);
  }
}

export class ProjectAbbrvForbiddenException extends ProjectAbbrvException {
  constructor(message: string) {
    super(ExceptionName.FORBIDDEN, message);
  }
}

export class ProjectAbbrvValidationException extends ProjectAbbrvException {
  constructor(message: string) {
    super(ExceptionName.VALIDATION_FAILED, message);
  }
}

export class ProjectAbbrvExternalServiceException extends ProjectAbbrvException {
  constructor(message: string) {
    super(ExceptionName.EXTERNAL_SERVICE_EXCEPTION, message);
  }
}

// TODO Add exception classes when needed.
