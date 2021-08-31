import { Operation } from "express-openapi";
export default function () {
  const GET: Operation = (req, res, next) => {
    res.status(200).json([
      { id: 0, message: "First todo" },
      { id: 1, message: "Second todo" },
    ]);
  };
  const POST: Operation = (req, res, next) => {
    res.status(200).json({ msg: req.body });
  };

  GET.apiDoc = {
    summary: "Fetch todos.",
    operationId: "getTodos",
    tags: ["test"],
    responses: {
      200: {
        description: "List of todos.",
        schema: {
          type: "array",
          items: {
            $ref: "#/definitions/Todo",
          },
        },
      },
    },
  };
  let operations = {
    GET,
    POST,
  };

  POST.apiDoc = {
    summary: "POst todos",
    operationId: "getTodos",
    tags: ["test"],

    parameters: [
      {
        in: "body",
        name: "body",
        required: true,
        schema: {
          type: "object",
          properties: {
            msg: { type: "string" },
          },
        },
      },
    ],
    responses: {
      200: {
        description: "ok",
        schema: {
          type: "object",
          properties: {
            msg: { type: "string" },
          },
        },
      },
    },
  };

  return operations;
}
