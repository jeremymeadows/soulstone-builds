import { defineConfig } from "drizzle-kit";
 
export default defineConfig({
  schema: "./src/lib/server/database/schema.ts",
  out: "./.drizzle",
  dialect: 'sqlite',
  dbCredentials: {
    url: 'db.sqlite',
  },
});