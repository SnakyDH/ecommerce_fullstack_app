import { ExceptionConstants } from './exception.constants';

export class ExceptionCustom extends Error {
  constructor(message: ExceptionConstants) {
    super(message);
  }
}
