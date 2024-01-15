export interface IExceptionInfo extends Record<string, string> {
  status: string;
  code: string;
  detail: string;
}
