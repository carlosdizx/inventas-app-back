import * as Joi from 'joi';

const JoiValidation = Joi.object({
  //Application
  APP_PORT: Joi.number().required(),
  APP_PREFIX: Joi.string().default('api'),

  //Database main
  DB_HOST: Joi.required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().required().default(false),

  // Cache
  CACHE_TTL: Joi.number().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),

  // Encrypt
  ENCRYPT_SECRET_KEY: Joi.string().required(),

  // SMTP
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().required(),
  SMTP_SECURE: Joi.boolean().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASSWORD: Joi.string().required(),
});

export default JoiValidation;
