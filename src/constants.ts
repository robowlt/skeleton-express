/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

// tslint:disable no-console max-line-length
export const BCRYPT_REGEXP = "^\\$2[ayb]\\$[0-9]{2}\\$[A-Za-z0-9./]{53}$";

// evaluate dates in the following format: `YYYY[-MM[-DD]]`
export const DATE_REGEXP = "^\\d{4}(?:-(0\\d|1[0-2]))?(?:-([0-2]\\d|3[01]))?";

export const UUID_BASIC_REGEXP = "^[a-z0-9-]{36}";

// prettier-ignore
export const UUID_FULL_REGEXP = "[0-9A-F]{8}[0-9A-F]{4}4[0-9A-F]{3}[89AB][0-9A-F]{3}[0-9A-F]{12}";
