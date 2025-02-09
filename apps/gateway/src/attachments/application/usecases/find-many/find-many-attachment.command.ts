import { BaseCommand } from "@repo/types";

export class FindManyAttachmentCommand extends BaseCommand {
  readonly attachmentIds!: string[];
}
