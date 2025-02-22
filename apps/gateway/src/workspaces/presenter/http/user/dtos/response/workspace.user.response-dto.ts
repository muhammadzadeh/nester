import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { AttachmentResponse } from '../../../../../../attachments/presenter/http';
import { WorkspaceEntity } from '../../../../../domain/entities/workspace.entity';

export class WorkspaceUserResponseDto {
	static from(item: WorkspaceEntity): WorkspaceUserResponseDto {
		return {
			id: item.id,
			title: item.title,
			logo: item.logo ? AttachmentResponse.from(item.logo) : null,
		};
	}

	@ApiProperty({
		type: String,
		description: 'The ID',
		example: 'a1b2c3d4e54as4df4',
	})
	@Type(() => String)
	readonly id!: string;

	@IsNotEmpty()
	@IsString()
	readonly title!: string;

	@ApiProperty({
		type: AttachmentResponse,
		description: 'The logo',
	})
	@Type(() => AttachmentResponse)
	readonly logo!: AttachmentResponse | null;
}
