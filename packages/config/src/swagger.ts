import { IsBoolean, IsOptional } from 'class-validator';
import { ToBoolean } from '@package/decorator';

export class SwaggerConfig {
	@IsOptional()
	@IsBoolean()
	@ToBoolean()
	handleGlobalPrefix?: boolean;

	@IsOptional()
	@IsBoolean()
	@ToBoolean()
	enabled?: boolean;
}
