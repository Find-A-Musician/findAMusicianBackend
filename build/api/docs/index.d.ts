declare const docs: {
    paths: {
        '/user/{other}/{test}': {
            get?: {
                tags?: string[];
                summary?: string;
                description?: string;
                externalDocs?: import("openapi-types").OpenAPIV3.ExternalDocumentationObject;
                operationId?: string;
                parameters?: (import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.ParameterObject)[];
                requestBody?: import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.RequestBodyObject;
                responses: import("openapi-types").OpenAPIV3.ResponsesObject;
                callbacks?: {
                    [callback: string]: import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.CallbackObject;
                };
                deprecated?: boolean;
                security?: import("openapi-types").OpenAPIV3.SecurityRequirementObject[];
                servers?: import("openapi-types").OpenAPIV3.ServerObject[];
            };
            post?: {
                tags?: string[];
                summary?: string;
                description?: string;
                externalDocs?: import("openapi-types").OpenAPIV3.ExternalDocumentationObject;
                operationId?: string;
                parameters?: (import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.ParameterObject)[];
                requestBody?: import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.RequestBodyObject;
                responses: import("openapi-types").OpenAPIV3.ResponsesObject;
                callbacks?: {
                    [callback: string]: import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.CallbackObject;
                };
                deprecated?: boolean;
                security?: import("openapi-types").OpenAPIV3.SecurityRequirementObject[];
                servers?: import("openapi-types").OpenAPIV3.ServerObject[];
            };
            put?: {
                tags?: string[];
                summary?: string;
                description?: string;
                externalDocs?: import("openapi-types").OpenAPIV3.ExternalDocumentationObject;
                operationId?: string;
                parameters?: (import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.ParameterObject)[];
                requestBody?: import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.RequestBodyObject;
                responses: import("openapi-types").OpenAPIV3.ResponsesObject;
                callbacks?: {
                    [callback: string]: import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.CallbackObject;
                };
                deprecated?: boolean;
                security?: import("openapi-types").OpenAPIV3.SecurityRequirementObject[];
                servers?: import("openapi-types").OpenAPIV3.ServerObject[];
            };
            delete?: {
                tags?: string[];
                summary?: string;
                description?: string;
                externalDocs?: import("openapi-types").OpenAPIV3.ExternalDocumentationObject;
                operationId?: string;
                parameters?: (import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.ParameterObject)[];
                requestBody?: import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.RequestBodyObject;
                responses: import("openapi-types").OpenAPIV3.ResponsesObject;
                callbacks?: {
                    [callback: string]: import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.CallbackObject;
                };
                deprecated?: boolean;
                security?: import("openapi-types").OpenAPIV3.SecurityRequirementObject[];
                servers?: import("openapi-types").OpenAPIV3.ServerObject[];
            };
            patch?: {
                tags?: string[];
                summary?: string;
                description?: string;
                externalDocs?: import("openapi-types").OpenAPIV3.ExternalDocumentationObject;
                operationId?: string;
                parameters?: (import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.ParameterObject)[];
                requestBody?: import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.RequestBodyObject;
                responses: import("openapi-types").OpenAPIV3.ResponsesObject;
                callbacks?: {
                    [callback: string]: import("openapi-types").OpenAPIV3.ReferenceObject | import("openapi-types").OpenAPIV3.CallbackObject;
                };
                deprecated?: boolean;
                security?: import("openapi-types").OpenAPIV3.SecurityRequirementObject[];
                servers?: import("openapi-types").OpenAPIV3.ServerObject[];
            };
        };
    };
    tags: {
        name: string;
    };
    components: {
        schemas: {
            test: {
                type: string;
                properties: {
                    message: {
                        type: string;
                    };
                    internal_code: {
                        type: string;
                    };
                };
            };
        };
    };
    servers: {
        url: string;
        description: string;
    }[];
    openapi: string;
    info: {
        version: string;
        title: string;
        description: string;
        contact: {
            name: string;
            email: string;
            url: string;
        };
    };
};
export default docs;
