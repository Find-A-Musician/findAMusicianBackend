import type {OpenAPIV3} from 'openapi-types';


 type HandlerDefinitionSchema = Partial<
  Record<
    'get' | 'post' | 'put' | 'patch' | 'delete',
    OpenAPIV3.OperationObject
  >
>;

export type HandlerDefinition = HandlerDefinitionSchema & {
  path: string;
};

// the type to the classic HTTP error
export type HttpError = {
  code: number;
  msg: string;
  stack?: string;
};

// the type for the components definition object
export type Component = {
  components: OpenAPIV3.ComponentsObject;
};

// the type for the express extends request
