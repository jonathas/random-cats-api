import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import Strategy from 'passport-headerapikey';
import { GeneralConfig } from '../config/general.config';

@Injectable()
export class HeaderApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  public constructor(private readonly config: ConfigService) {
    super(
      { header: 'X-API-KEY', prefix: '' },
      true,
      (apiKey: string, done: (error: Error, data: unknown) => {}) => {
        return this.validate(apiKey, done);
      }
    );
  }

  public validate = (apiKey: string, done: (error: Error, data: unknown) => {}) => {
    const generalConfig = this.config.get<GeneralConfig>('general');
    if (generalConfig.apiKey === apiKey) {
      done(null, true);
    }
    done(new UnauthorizedException(), null);
  };
}
