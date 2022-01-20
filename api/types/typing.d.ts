import type { OpenAPIV3 } from 'openapi-types';
type HandlerDefinitionSchema = Partial<
  Record<'get' | 'post' | 'put' | 'patch' | 'delete', OpenAPIV3.OperationObject>
>;

/**
 * @description the type for an OpenAPI definition extends with path
 */
export type HandlerDefinition = HandlerDefinitionSchema & {
  path: string;
};

/**
 * @description The component types definition
 */
export type Component = {
  components: OpenAPIV3.ComponentsObject;
};

/**
 * @description extract the body object types from an OpenAPI type definition
 * @param T An OpenAPI type definition
 */
export type getRequestBody<T> = T extends {
  requestBody: { content: { 'application/json': Record<string, unknown> } };
}
  ? T['requestBody']['content']['application/json']
  : never;

/**
 * @description Return an union of all the HTTP code available in the responses
 *              of the OpenAPI definition
 * @param T An OpenAPI type definition
 *
 */
export type getHTTPCode<T> = T extends { responses: Record<string, unknown> }
  ? keyof T['responses']
  : never;

/**
 * @description Return an union of all the response body available in the responses
 *              of the OpenAPI definition
 * @param T An OpenAPI type definition
 */
type getResponsesBody<T> = T extends {
  responses: { [code: string]: { content: Record<string, unknown> } };
}
  ? T['responses'][keyof T['responses']]['content']['application/json']
  : never;

/**
 * @description Return an union of all the paths value available in the request
 *              of the OpenAPI definition
 * @param T An OpenAPI type definition
 *
 */
export type getPathParams<T> = T extends {
  parameters: { path: Record<string, unknown> };
}
  ? T['parameters']['path']
  : never;

/**
 * @description Return an union of all the query value available in the request
 *              of the OpenAPI definition
 * @param T An OpenAPI type definition
 *
 */
export type getRequestQuery<T> = T extends {
  parameters: { query: Record<string, unknown> };
}
  ? T['parameters']['query']
  : never;
