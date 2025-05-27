export type GoogleError = {
  code: number;
  message: string;
  errors: Record<string, any>;
  status: string;
  details: Record<string, any>[];
};
