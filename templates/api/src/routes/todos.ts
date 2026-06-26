import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

interface Todo {
  id: string;
  title: string;
  done: boolean;
}

// In-memory store — swap for a real database in production.
const store = new Map<string, Todo>();

const createSchema = z.object({ title: z.string().min(1) });
const updateSchema = z.object({
  title: z.string().min(1).optional(),
  done: z.boolean().optional(),
});

export const todos = new Hono()
  .get("/", (c) => c.json([...store.values()]))
  .post("/", zValidator("json", createSchema), (c) => {
    const { title } = c.req.valid("json");
    const todo: Todo = { id: crypto.randomUUID(), title, done: false };
    store.set(todo.id, todo);
    return c.json(todo, 201);
  })
  .get("/:id", (c) => {
    const todo = store.get(c.req.param("id"));
    if (!todo) throw new HTTPException(404, { message: "Todo not found" });
    return c.json(todo);
  })
  .patch("/:id", zValidator("json", updateSchema), (c) => {
    const todo = store.get(c.req.param("id"));
    if (!todo) throw new HTTPException(404, { message: "Todo not found" });
    Object.assign(todo, c.req.valid("json"));
    return c.json(todo);
  })
  .delete("/:id", (c) => {
    if (!store.delete(c.req.param("id"))) {
      throw new HTTPException(404, { message: "Todo not found" });
    }
    return c.body(null, 204);
  });
