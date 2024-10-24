import { Global, Module } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Configuration } from './configuration';
import { DefaultConfigLoaderService, VaultService } from './services';
import { mergeObjects } from '@repo/utils';
import * as VaultClient from 'node-vault';

const configProvider = {
  provide: Configuration,
  useFactory: async (): Promise<Configuration> => {
    const defaultConfigLoader = new DefaultConfigLoaderService('config.yml');

    const defaultConfig = defaultConfigLoader.getMappedConfig<Configuration>();
    const { vault: vaultConfig, app: appConfig } = defaultConfig;
    let mergedConfig = defaultConfig;

    if (vaultConfig) {
      const vaultClient = VaultClient.default({
        endpoint: vaultConfig.host,
        token: vaultConfig.token,
      });

      const defaultPath = `${vaultConfig.backend}/data/${appConfig.name}/${appConfig.env}`;
      const vaultService = new VaultService(vaultClient, defaultPath);
      const vaultStoredConfigs = await vaultService.read<Configuration>();
      mergedConfig = mergeObjects(defaultConfig, vaultStoredConfigs);
    }

    const configInstance = plainToInstance(Configuration, mergedConfig);

    configInstance.validate();

    return configInstance;
  },
};

@Global()
@Module({
  controllers: [],
  providers: [configProvider],
  exports: [Configuration],
})
export class ConfigModule {}

