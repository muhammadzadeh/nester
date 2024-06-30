import { Global, Module } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RootConfig } from './root';
import { DefaultConfigLoaderService, VaultService } from './services';
import { mergeObjects } from '../utils';
import * as VaultClient from 'node-vault';

const configProvider = {
  provide: RootConfig,
  useFactory: async (): Promise<RootConfig> => {
    const defaultConfigLoader = new DefaultConfigLoaderService('config.yml');

    const defaultConfig = defaultConfigLoader.getMappedConfig<RootConfig>();
    const { vault: vaultConfig, app: appConfig } = defaultConfig;
    let mergedConfig = defaultConfig;

    if (vaultConfig) {
      const vaultClient = VaultClient.default({
        endpoint: vaultConfig.host,
        token: vaultConfig.token,
      });

      const defaultPath = `${vaultConfig.backend}/data/${appConfig.name}/${appConfig.env}`;
      const vaultService = new VaultService(vaultClient, defaultPath);
      const vaultStoredConfigs = await vaultService.read<RootConfig>();
      mergedConfig = mergeObjects(defaultConfig, vaultStoredConfigs);
    }

    const configInstance = plainToInstance(RootConfig, mergedConfig);

    configInstance.validate();

    return configInstance;
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
