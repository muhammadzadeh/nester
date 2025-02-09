import { BaseCommand } from "@repo/types";

export class UpdateAttachmentShareFlagCommand extends BaseCommand {
  readonly attachmentIds!: string[];
  readonly isShared!: boolean;
}
