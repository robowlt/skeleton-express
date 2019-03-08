/**
 * https://dl2.dev - DL2 IT Services
 * Owlsome solutions. Owltstanding results.
 */

// evaluate dates in the following format: `YYYY[-MM[-DD]]`
export const DATE_REGEX = "^\\d{4}(?:-(0\\d|1[0-2]))?(?:-([0-2]\\d|3[01]))?";

export const UUID_BASIC_REGEX = "^[a-z0-9-]{36}";

// tslint:disable no-console max-line-length
// prettier-ignore
export const UUID_FULL_REGEX = "[0-9A-F]{8}[0-9A-F]{4}4[0-9A-F]{3}[89AB][0-9A-F]{3}[0-9A-F]{12}";
// tslint:enable
