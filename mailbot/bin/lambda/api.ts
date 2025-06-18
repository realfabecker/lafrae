import serverless from "serverless-http";
import { MailbotHttpController } from "../../src/handlers/http/controllers/MailbotHttpController";
export const handler = serverless(MailbotHttpController.new().getApp());
