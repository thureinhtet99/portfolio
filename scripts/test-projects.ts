import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
process.env.VERCEL = "1";

async function test() {
  const { getProjects } =
    await import("../features/projects/services/project.service");
  try {
    const projects = await getProjects();
    console.log("Projects:", JSON.stringify(projects, null, 2));
  } catch (err) {
    console.error("ERROR:", err);
  }
}
test();
