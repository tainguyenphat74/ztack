import { expect, test } from "bun:test";

import { createApp } from "../src/app";

const app = createApp();

test("GET /health returns healthy", async () => {
  const res = await app.request("/health");
  expect(res.status).toBe(200);
  expect(await res.json()).toMatchObject({ status: "healthy" });
});

test("todos CRUD happy path", async () => {
  const created = await app.request("/todos", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: "write tests" }),
  });
  expect(created.status).toBe(201);
  const todo = (await created.json()) as { id: string; done: boolean };
  expect(todo.done).toBe(false);

  const fetched = await app.request(`/todos/${todo.id}`);
  expect(fetched.status).toBe(200);

  const patched = await app.request(`/todos/${todo.id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ done: true }),
  });
  expect((await patched.json()).done).toBe(true);

  const removed = await app.request(`/todos/${todo.id}`, { method: "DELETE" });
  expect(removed.status).toBe(204);
});

test("POST /todos rejects invalid body", async () => {
  const res = await app.request("/todos", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title: "" }),
  });
  expect(res.status).toBe(400);
});

test("unknown todo returns 404", async () => {
  const res = await app.request("/todos/does-not-exist");
  expect(res.status).toBe(404);
});
