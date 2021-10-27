import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

const security: OpenAPIV3.Document['security'] = [{ bearerAuth: [] }];

export default security;
