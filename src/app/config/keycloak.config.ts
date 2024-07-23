import { ConfigService, registerAs } from '@nestjs/config';
import { PolicyEnforcementMode, TokenValidation } from 'nest-keycloak-connect';
import { AppConfigKey, IAppConfig } from './app.config';
import { Environment } from './config';

enum KeycloakConfigKey {
  AUTH_SERVER_URL = 'AUTH_SERVER_URL',
  REALM = 'REALM',
  CLIENT_ID = 'CLIENT_ID',
  SECRET = 'SECRET',
}

type IKeycloakConfig = {
  [KeycloakConfigKey.AUTH_SERVER_URL]: string | undefined;
  [KeycloakConfigKey.REALM]: string | undefined;
  [KeycloakConfigKey.CLIENT_ID]: string | undefined;
  [KeycloakConfigKey.SECRET]: string | undefined;
};

export default registerAs('', () => ({
  [KeycloakConfigKey.AUTH_SERVER_URL]: process.env[KeycloakConfigKey.AUTH_SERVER_URL],
  [KeycloakConfigKey.REALM]: process.env[KeycloakConfigKey.REALM],
  [KeycloakConfigKey.CLIENT_ID]: process.env[KeycloakConfigKey.CLIENT_ID],
  [KeycloakConfigKey.SECRET]: process.env[KeycloakConfigKey.SECRET],
}));

export function getKeycloakConfig(configService: ConfigService) {
  const authServerUrl = configService.get<IKeycloakConfig['AUTH_SERVER_URL']>(KeycloakConfigKey.AUTH_SERVER_URL);
  const realm = configService.get<IKeycloakConfig['REALM']>(KeycloakConfigKey.REALM);
  const clientId = configService.get<IKeycloakConfig['CLIENT_ID']>(KeycloakConfigKey.CLIENT_ID);
  const secret = configService.get<IKeycloakConfig['SECRET']>(KeycloakConfigKey.SECRET);
  const logLevels =
    configService.get<IAppConfig['NODE_ENV']>(AppConfigKey.NODE_ENV) === Environment.Production
      ? (['error'] as any)
      : (['error', 'verbose'] as any);

  return {
    authServerUrl,
    realm,
    clientId,
    secret,
    policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
    tokenValidation: TokenValidation.ONLINE,
    logLevels,
  };
}
