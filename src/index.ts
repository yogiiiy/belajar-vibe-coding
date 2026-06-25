import { Elysia } from "elysia";
import { db, users } from "./db";
import { usersRoute } from "./routes/users-route";

const app = new Elysia()
  .get("/", () => ({ status: "OK", message: "Elysia server is running!" }))
  .get("/users", async () => {
    try {
      const allUsers = await db.select().from(users);
      return { success: true, data: allUsers };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  })
  .use(usersRoute)
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
