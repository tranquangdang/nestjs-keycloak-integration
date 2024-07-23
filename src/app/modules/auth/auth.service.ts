import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as qs from 'qs';
import { LoginDto } from './dtos/login-dto';
import { ConfigService } from '@nestjs/config';
import { getKeycloakConfig } from 'src/app/config/keycloak.config';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {}

  async loginKeycloak({ username, password }: LoginDto) {
    const { clientId: client_id, secret: client_secret, authServerUrl, realm } = getKeycloakConfig(this.configService);

    const data = {
      username,
      password,
      grant_type: 'password',
      client_secret,
      client_id,
      scope: 'openid',
    };

    const user = await this.httpService
      .post<{
        access_token: string;
        expires_in: number;
        refresh_expires_in: number;
        refresh_token: string;
        token_type: string;
        'not-before-policy': number;
        session_state: string;
        scope: string;
      }>(`${authServerUrl}/realms/${realm}/protocol/openid-connect/token`, qs.stringify(data), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .toPromise();

    return user.data;
  }
}
