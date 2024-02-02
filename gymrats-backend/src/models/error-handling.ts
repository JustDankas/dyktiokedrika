export interface SqlError {
  code: string;
  errno: number;
  sql: string;
  sqlMessage: string;
}

export function isSqlError(obj: any): obj is SqlError {
  return "code" in obj && "errno" in obj && "sql" in obj && "sqlMessage" in obj;
}

export function isValidIsoDate(dateString: string): boolean {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  return isoDateRegex.test(dateString);
}
