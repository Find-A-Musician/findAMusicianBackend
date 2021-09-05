import type {OpenAPIV3} from 'openapi-types';


export type HandlerDefinition=
    Partial<Record<'get'|'post'|'put'|'patch' |'delete',
        OpenAPIV3.OperationObject>>
