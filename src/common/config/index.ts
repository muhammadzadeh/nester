import { Global, Module } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RootConfig } from './root';
import { DefaultConfigLoaderService, VaultService } from './services';
import { mergeObjects } from '../utils';
import * as VaultClient from 'node-vault';

const configProvider = {
  provide: RootConfig,
  useFactory: async (): Promise<RootConfig> => {
    const default_config_loader = new DefaultConfigLoaderService('config.yml');

    const default_config = default_config_loader.getMappedConfig<RootConfig>();
    const { vault: vault_config, app: app_config } = default_config;
    let merged_config = default_config;

    if (vault_config) {
      const vault_client = VaultClient.default({
        endpoint: vault_config.host,
        token: vault_config.token,
      });

      const defaultPath = `${vault_config.backend}/data/${app_config.name}/${app_config.env}`;
      const vault_service = new VaultService(vault_client, defaultPath);
      const vault_stored_configs = await vault_service.read<RootConfig>();
      merged_config = mergeObjects(default_config, vault_stored_configs);
    }

    const config_instance = plainToInstance(RootConfig, merged_config);

    config_instance.validate();

    return config_instance;
  },
};

@Global()
@Module({
  controllers: [],
  providers: [configProvider],
  exports: [RootConfig],
})
class ConfigModule {}

export { ConfigModule, RootConfig as Configuration };
