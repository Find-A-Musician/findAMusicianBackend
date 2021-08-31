const apiDoc = {
  swagger: "2.0",
  basePath: "/",
  info: {
    title: "Todo app API.",
    version: "1.0.0",
  },
  definitions: {
    Todo: {
      type: "object",
      properties: {
        id: {
          type: "number",
        },
        message: {
          type: "string",
        },
      },
      required: ["id", "message"],
    },
    Musicians: {
      type: "object",
      properties: {
        id: { type: "number" },
        email: { type: "string", format: "email" },
        given_name: { type: "string" },
        family_name: { type: "string" },
        phone: { type: "number" },
        facebook_url: { type: "string" },
      },
      required: ["id", "email"],
    },
  },
  paths: {},
};

module.exports = apiDoc;
