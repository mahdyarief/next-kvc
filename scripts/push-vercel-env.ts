import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ENV_FILE = 'env.vercel';
const DEFAULT_ENV = 'production';

async function pushEnv() {
  const filePath = path.join(process.cwd(), ENV_FILE);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${ENV_FILE}`);
    process.exit(1);
  }

  console.log(`🚀 Loading ${ENV_FILE}...`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const lines = content.split('\n');
  const envVars: [string, string][] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // Handle KEY=VALUE cases
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();

      // Remove leading/trailing quotes if they exist
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }

      envVars.push([key, value]);
    }
  }

  console.log(`📡 Sending ${envVars.length} variables to Vercel...`);

  for (const [key, value] of envVars) {
    try {
      // Use 'printf' to avoid issues with special characters in values
      // env add <key> <env> - value is passed via stdin
      // We'll push to 'production' by default
      console.log(`   ⬆️ Adding ${key}...`);
      
      // Standard: echo "value" | vercel env add key production
      // We use a temporary command to handle this
      const cleanValue = value.replace(/"/g, '\\"'); // Escape quotes for the shell
      execSync(`echo "${cleanValue}" | vercel env add ${key} ${DEFAULT_ENV}`, { stdio: 'inherit' });
    } catch (err: any) {
      console.error(`   ❌ Failed to add ${key}: ${err.message}`);
    }
  }

  console.log('\n✅ Environment variables pushed successfully!');
  console.log('🔗 Visit: https://vercel.com/dashboard to verify.');
}

pushEnv();
