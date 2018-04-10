import Joi from 'joi';
import * as schemaKeys from '../constants/schemas';

export function validate(obj, schemaKey) {
  const result = Joi.validate(obj, schemas[schemaKey]);
  if (result.error !== null) {
    throw result.error;
  } else {
    return obj;
  }
}

const schemas = {
  [schemaKeys.CREATE_REQUEST]: Joi.object().keys({
    username: Joi.string().required(),
    birthtime: Joi.date().required(),
    img_location: Joi.string().uri({
      scheme: [
        /https?/,
      ],
    }).required(),
    img_key: Joi.string().required(),
    people: Joi.array().items(Joi.string()).unique(),
    tags: Joi.array().items(Joi.string()).unique(),
    meta: Joi.object(),
  }),
}

