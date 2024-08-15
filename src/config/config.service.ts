import { type Config } from './config.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService, Path, PathValue } from '@nestjs/config';

/**
 * @class ConfigService
 * This service is a wrapper around the NestConfig service from the \@nestjs/config package.
 *
 * Automatically infer type in the get method.
 */
@Injectable()
export class CustomConfigService<T = Config> extends ConfigService<T> {
  /**
   * get method
   *
   * Automatically infer type in the get method.
   *
   * @param path
   * @returns environment variable value
   */
  override get<P extends Path<T>>(path: P): PathValue<T, P> {
    const value = super.get(path, { infer: true });

    if (value === undefined) {
      throw new Error(`ConfigService: Missing value for path ${path}`);
    }

    return value;
  }
}
