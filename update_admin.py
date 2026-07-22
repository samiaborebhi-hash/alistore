#!/usr/bin/env python3
"""Update admin credentials via the public API."""
import subprocess, json, sys

BASE = "https://novapure.beauty"

# Step 1: Login with old credentials to get session token
print("Step 1: Logging in with old credentials...")
login_result = subprocess.run(
    ["curl", "-s", "-c", "-", "-X", "POST",
     f"{BASE}/api/auth/callback/credentials",
     "-H", "Content-Type: application/x-www-form-urlencoded",
     "-d", "email=admin%40alipro.com&password=Admin%40123456&csrfToken=&callbackUrl=%2Fadmin&json=true"],
    capture_output=True, text=True, timeout=30
)
print(f"Login status: {login_result.returncode}")
print(f"Login output: {login_result.stdout[:200]}")

# Step 2: Use prisma to update the user directly via a script
# Since we can't access Neon directly, we'll use npx prisma with the Neon URL
# The user needs to provide the Neon DATABASE_URL

print("\nAlternative: Update via Prisma script")
print("Run this command with your Neon DATABASE_URL:")
print('DATABASE_URL="postgresql://..." npx tsx -e "')
print('  const { PrismaClient } = require("@prisma/client");')
print('  const bcrypt = require("bcryptjs");')
print('  const db = new PrismaClient();')
print('  async function main() {')
print('    const hash = await bcrypt.hash("aaAA1232!@!#ASD", 10);')
print('    await db.user.update({')
print('      where: { email: "admin@alipro.com" },')
print('      data: { email: "rebhi9964@gmail.com", passwordHash: hash }')
print('    });')
print('    console.log("Admin updated!");')
print('  }')
print('  main().catch(console.error).finally(() => db.$disconnect());')
print('"')