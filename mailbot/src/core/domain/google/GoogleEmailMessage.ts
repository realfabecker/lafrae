type GoogleEmailHeader = {
  name: string;
  value: string;
};

type GoogleEmailPart = {
  partId: string;
  mimeType: string;
  filename: string;
  headers: GoogleEmailHeader[];
  body: {
    size: number;
    data?: string;
    attachmentId?: string;
  };
  parts: GoogleEmailPart[];
};

export type GoogleEmailMessage = {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    partId: string;
    mimeType: string;
    filename: string;
    headers: GoogleEmailHeader[];
    body: {
      size: number;
    };
    parts: GoogleEmailPart[];
  };
  sizeEstimate: number;
  historyId: string;
  internalDate: string;
};
