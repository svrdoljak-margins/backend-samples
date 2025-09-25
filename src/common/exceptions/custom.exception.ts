/**
 * Custom exception classes for project-specific exceptions.
 */

import { ExceptionName } from './custom.exception.enum';
import { ICustomExceptionInfo } from './exception-info.interface';
import { getException } from './metadata.exception';

export abstract class TaskManagerException extends Error {
  public exceptionName: ExceptionName;
  public exceptionInfo: ICustomExceptionInfo;

  constructor(exceptionName: ExceptionName, message: string) {
    super(message);
    this.exceptionName = exceptionName;
    this.exceptionInfo = getException(exceptionName);
    this.exceptionInfo.detail = message;
  }

  public toString = (): string => {
    return `${this.exceptionName} exception:\n${this.exceptionInfo}`;
  };
}

export class TaskManagerNotFoundException extends TaskManagerException {
  constructor(message: string) {
    super(ExceptionName.NOT_FOUND, message);
  }
}

export class TaskManagerConflictException extends TaskManagerException {
  constructor(message: string) {
    super(ExceptionName.CONFLICT, message);
  }
}

export class TaskManagerForbiddenException extends TaskManagerException {
  constructor(message: string) {
    super(ExceptionName.FORBIDDEN, message);
  }
}

export class TaskManagerValidationException extends TaskManagerException {
  constructor(message: string) {
    super(ExceptionName.VALIDATION_FAILED, message);
  }
}

export class TaskManagerExternalServiceException extends TaskManagerException {
  constructor(message: string) {
    super(ExceptionName.EXTERNAL_SERVICE_EXCEPTION, message);
  }
}
