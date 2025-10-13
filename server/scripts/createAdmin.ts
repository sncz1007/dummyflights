import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { db } from "../db";
import { users } from "@shared/schema";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  try {
    const adminUsername = "admin";
    const adminPassword = "admin123";
    
    const hashedPassword = await hashPassword(adminPassword);
    
    const [admin] = await db
      .insert(users)
      .values({
        username: adminUsername,
        password: hashedPassword,
        role: "admin",
      })
      .returning();
    
    console.log("Admin user created successfully!");
    console.log("Username:", adminUsername);
    console.log("Password:", adminPassword);
    console.log("IMPORTANT: Please change the password after first login!");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
