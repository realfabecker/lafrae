import { IssueStatus } from "../issues/enums/IssueStatus";

export interface Issue {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: {
    summary: string;
    issuetype: {
      self: string;
      id: string;
      description: string;
      iconUrl: string;
      name: string;
      subtask: boolean;
      avatarId: number;
      hierarchyLevel: number;
    };
    creator: {
      self: string;
      accountId: string;
      emailAddress: string;
      avatarUrls: {
        "48x48": string;
        "24x24": string;
        "16x16": string;
        "32x32": string;
      };
      displayName: string;
      active: boolean;
      timeZone: string;
      accountType: string;
    };
    created: string;
    customfield_10041: {
      self: string;
      value: string;
      id: string;
    };
    customfield_10020: Array<{
      id: number;
      name: string;
      state: string;
      boardId: number;
      goal: string;
      startDate: string;
      endDate: string;
      completeDate: string;
    }>;
    customfield_10031: number;
    assignee: {
      self: string;
      accountId: string;
      emailAddress: string;
      avatarUrls: {
        "48x48": string;
        "24x24": string;
        "16x16": string;
        "32x32": string;
      };
      displayName: string;
      active: boolean;
      timeZone: string;
      accountType: string;
    };
    priority: {
      self: string;
      iconUrl: string;
      name: string;
      id: string;
    };
    status: {
      self: string;
      description: string;
      iconUrl: string;
      name: IssueStatus;
      id: string;
      statusCategory: {
        self: string;
        id: number;
        key: string;
        colorName: string;
        name: string;
      };
    };
  };
}
