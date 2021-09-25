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
  requestBody: { content: { 'application/json': object } };
}
  ? T['requestBody']['content']['application/json']
  : never;

/**
 * @description Return an union of all the HTTP code available in the responses
 *              of the OpenAPI definition
 * @param T An OpenAPI type definition
 *
 */
export type getCode<T> = T extends { responses: object }
  ? keyof T['responses']
  : never;

type getResponses<T> = T extends { responses: object }
  ? T['responses'][keyof T['responses']]
  : never;

type getResponsesExp<T> = T extends {
  responses: { [code: string]: { content: { 'application/json': object } } };
}
  ? T
  : never;

type test = operations['getGenres'];
type oui = GetBody<test>;
type code = getCode<test>;
type res = getResponses<test>;
type res = getResponsesExp<test>;

type ouii = Pick<res, 'content'>;
