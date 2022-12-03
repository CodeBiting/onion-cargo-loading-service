const apiDoc = {
  swagger: "2.0",
  basePath: "/v1",  // S'ha de posar la ruta amb la versió v1 en l'atribut url de swagger en el fitxer app.js
  info: {
    title: "Container app API.",
    version: "1.0.0",
  },
  definitions: {
    Error: {
      additionalProperties: true,
    },
    Container: {
      type: "object",
      properties: {
        id: {
          type: "number",
        },
        code: {
          type: "string",
        },
        description: {
          type: "string",
        },
        width: {
          type: "number",
        },
        legth: {
          type: "number",
        },
        height: {
          type: "number",
        },
        maxWeight: {
          type: "number",
        },
      },
      required: ["id", "code", "width", "length", "height", "maxWeight"],
    },
  },
  paths: {},

  // tags is optional, and is generated / sorted by the tags defined in your path
  // docs.  This API also defines 2 tags in operations: "creating" and "fooey".
  tags: [
    // {name: 'creating'} will be inserted by ./api-routes/users.js
    // {name: 'fooey'} will be inserted by ./api-routes/users/{id}.js
    //{ description: 'Everything users', name: 'users' },
  ]
};

module.exports = apiDoc;

