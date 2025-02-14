import { BaseCommand } from "@repo/types";

export class DeleteAttachmentCommand extends BaseCommand {
  readonly attachmentId!: string;
}
