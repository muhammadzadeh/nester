import { BaseCommand } from "@repo/types";

export class RemoveAttachmentDraftFlagCommand extends BaseCommand {
  readonly attachmentIds!: string[];
}
