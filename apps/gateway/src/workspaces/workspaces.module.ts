import { Module } from "@nestjs/common";
import { WorkspacesService } from "./application/workspaces.service";

@Module({
    imports: [],
    providers: [WorkspacesService],
    controllers: [],
    exports: []
})
export class WorkspacesModule { }