import type { OpenAPIV3 } from 'openapi-types';
import type { operations } from '@schema';

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
export type GetBody<T> = T extends {
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
export type getCode<T> = T extends { responses: Record<string, unknown> }
  ? keyof T['responses']
  : never;

/**
 * @description Return an union of all the response body available in the responses
 *              of the OpenAPI definition
 * @param T An OpenAPI type definition
 */
type getResponses<T> = T extends {
  responses: { [code: string]: { content: Record<string, unknown> } };
}
  ? T['responses'][keyof T['responses']]['content']['application/json']
  : never;
