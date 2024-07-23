import appConfig from './app.config';
import keycloakConfig from './keycloak.config';

export enum Environment {
  Local = 'local',
  Production = 'production',
}

export const configurations = [appConfig,  keycloakConfig];
