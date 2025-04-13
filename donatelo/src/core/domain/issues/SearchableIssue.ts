import { IssueProvider } from "core/domain/issues/enums/IssueProvider";
import { AbstractModel } from "../AbstractModel";
import { IssueStatus } from "./enums/IssueStatus";

type IssueProps = {
  id: string;
  title: string;
  assignee: string;
  status: IssueStatus;
  createdAt: Date;
  link: string;
  externalId: string;
  issueType?: string;
  priority?: string;
  sprint?: string;
  team?: string;
  storyPoints?: number;
};

export class SearchableIssue extends AbstractModel {
  constructor(props?: Partial<IssueProps>) {
    super(props);
  }

  public getId(): string {
    return this.get("id");
  }

  public setId(id: string) {
    this.set("id", id);
  }

  public getExternalId() {
    return this.get("externalId");
  }

  public setExternalId(externalId: string) {
    this.set("externalId", externalId);
  }

  public getTitle(): string {
    return this.get("title");
  }

  public setTitle(title: string) {
    this.set("title", title);
  }

  public setAssignee(assignee: string) {
    this.set("assignee", assignee);
  }

  public getAssignee(): string {
    return this.get("assignee");
  }

  public getStatus() {
    return this.get("status");
  }

  public setStatus(status: string) {
    this.set("status", status);
  }

  public getCreatedAt(): Date {
    return this.get("createdAt");
  }

  public setCreatedAt(createdAt: Date) {
    this.set("createdAt", createdAt);
  }

  public getLink(): string {
    return this.get("link");
  }

  public setLink(link: string) {
    this.set("link", link);
  }

  public getIssueType(): string {
    return this.get("issueType");
  }

  public setIssueType(issueType: string): void {
    this.set("issueType", issueType);
  }

  public getPriority(): string {
    return this.get("priority");
  }

  public setPriority(priority: string): void {
    this.set("priority", priority);
  }

  public getSprint(): string {
    return this.get("sprint");
  }

  public setSprint(sprint: string): void {
    this.set("sprint", sprint);
  }

  public getTeam(): string {
    return this.get("team");
  }

  public setTeam(team: string): void {
    this.set("team", team);
  }

  public getStoryPoints(): number {
    return this.get("storyPoints");
  }

  public setStoryPoints(storyPoints: number): void {
    this.set("storyPoints", storyPoints);
  }
}
