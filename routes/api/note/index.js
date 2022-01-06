"use strict";

const table = "notes";
module.exports = async function (fastify, opts, next) {
  fastify.route({
    method: "GET",
    url: "/notes",
	
    // schema: {
    //   tags: ["Notes"],
    //   description: "Get all notes",
    //   response: {
    //     200: {
    //       type: "array",
    //       items: {
    //         type: "object",
    //         properties: {
    //           id: {
    //             type: "string",
    //             description: "Unique identifier for a specific note.",
    //           },
    //           title: {
    //             type: "string",
    //           },
    //           body: {
    //             type: "string",
    //             description: "Main content of the note.",
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
    handler: async (request, reply) => {
      const client = await fastify.pg.connect();
      const { rows } = await client.query(
        "SELECT * FROM " + table + " ORDER BY id ASC"
      );
      client.release();
      return rows;
    },
  });

  fastify.route({
    method: "GET",
    url: "/notes/:id",

    handler: async (request, reply) => {
      const client = await fastify.pg.connect();
      const { id } = request.params;
      const { rows } = await client.query(
        "SELECT * FROM " + table + " WHERE id = $1",
        [id]
      );
      client.release();
      return rows;
    },
  });

  fastify.route({
    method: "POST",
    url: "/notes",
    schema: {
      tags: ["Notes"],
      description: "Create a note",
      body: {
        type: "object",
        required: ["title", "body"],
        properties: {
          title: { type: "string" },
          body: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "Unique identifier for a specific note.",
            },
            title: {
              type: "string",
            },
            body: {
              type: "string",
              description: "Main content of the note.",
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const client = await fastify.pg.connect();
      const { rows } = await client.query(
        "INSERT INTO " + table + " (title, body) VALUES ($1, $2) RETURNING *",
        [request.body.title, request.body.body]
      );
      client.release();
      return "sucess";
    },
  });

  fastify.route({
    method: "POST",
    url: "/update-notes",
    schema: {
      tags: ["Notes"],
      description: "Update a note",
      body: {
        type: "object",
        required: ["id","title", "body"],
        properties: {
          id: { type: "number" },
          title: { type: "string" },
          body: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "Unique identifier for a specific note.",
            },
            title: {
              type: "string",
            },
            body: {
              type: "string",
              description: "Main content of the note.",
            },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const client = await fastify.pg.connect();
      const { rows } = await client.query(
        "UPDATE " +
          table +
          " SET title = $1, body = $2 WHERE id= $3 RETURNING *",
        [request.body.title, request.body.body, request.body.id]
      );
      client.release();
      return "sucess";
    },
  });

  // fastify.route({
  //   method: "GET",
  //   url: "/notes/:id",
  //   schema: {
  //     tags: ["Notes"],
  //     description: "Get single note",
  //     params: {
  //       type: "object",
  //       required: ["id"],
  //       properties: {
  //         id: { type: "number" },
  //       },
  //     },
  //     response: {
  //       204: {
  //         type: "object",
  //         default: "No content",
  //       },
  //     },
  //   },
  //   handler: async (request, reply) => {
  //     const client = await fastify.pg.connect();
  //     const { rows } = await client.query(
  //       "SELECT * FROM " + table + " WHERE id=$1",
  //       [request.params.id]
  //     );
  //     client.release();
  //     return rows;
  //   },
  // });

  // fastify.route({
  //   method: "POST",
  //   url: "/notes",
  //   schema: {
  //     tags: ["Notes"],
  //     description: "Create a note",
  //     body: {
  //       type: "object",
  //       required: ["title", "body"],
  //       properties: {
  //         title: { type: "string" },
  //         body: { type: "string" },
  //       },
  //     },
  //     response: {
  //       200: {
  //         type: "object",
  //         properties: {
  //           id: {
  //             type: "number",
  //             description: "Unique identifier for a specific note.",
  //           },
  //           title: {
  //             type: "string",
  //           },
  //           body: {
  //             type: "string",
  //             description: "Main content of the note.",
  //           },
  //         },
  //       },
  //     },
  //   },
  //   handler: async (request, reply) => {
  //     const client = await fastify.pg.connect();
  //     const { rows } = await client.query(
  //       "INSERT INTO " + table + " (title, body) VALUES ($1, $2) RETURNING *",
  //       [request.body.title, request.body.body]
  //     );
  //     client.release();
  //     return rows;
  //   },
  // });

  // fastify.route({
  //   method: "PUT",
  //   url: "/notes/:id",
  //   schema: {
  //     tags: ["Notes"],
  //     description: "Update a note",
  //     params: {
  //       type: "object",
  //       required: ["id"],
  //       properties: {
  //         id: { type: "number" },
  //       },
  //     },
  //     body: {
  //       type: "object",
  //       required: ["title", "body"],
  //       properties: {
  //         title: { type: "string" },
  //         body: { type: "string" },
  //       },
  //     },
  //     response: {
  //       200: {
  //         type: "object",
  //         properties: {
  //           id: {
  //             type: "number",
  //             description: "Unique identifier for a specific note.",
  //           },
  //           title: {
  //             type: "string",
  //           },
  //           body: {
  //             type: "string",
  //             description: "Main content of the note.",
  //           },
  //         },
  //       },
  //     },
  //   },
  //   handler: async (request, reply) => {
  //     const client = await fastify.pg.connect();
  //     const { rows } = await client.query(
  //       "UPDATE " +
  //         table +
  //         " SET title = $1, body = $2 WHERE id= $3 RETURNING *",
  //       [request.body.title, request.body.body, request.params.id]
  //     );
  //     client.release();
  //     return rows;
  //   },
  // });

  // fastify.route({
  //   method: "DELETE",
  //   url: "/notes/:id",
  //   schema: {
  //     tags: ["Notes"],
  //     description: "Delete a note",
  //     params: {
  //       type: "object",
  //       required: ["id"],
  //       properties: {
  //         id: { type: "number" },
  //       },
  //     },
  //     response: {
  //       204: {
  //         type: "string",
  //         default: "No content",
  //       },
  //     },
  //   },
  //   handler: async (request, reply) => {
  //     const client = await fastify.pg.connect();
  //     const { rows } = await client.query(
  //       "DELETE " + table + " WHERE id= $1 RETURNING *",
  //       [request.params.id]
  //     );
  //     client.release();
  //     return rows;
  //   },
  // });
  next();
};