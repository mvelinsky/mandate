import fs from "node:fs"
import path from "node:path"

interface EnvModel {
  [key: string]: string | boolean | number
}

function parseEnvValue(value: string | boolean | number): { defaultValue: string, alternatives: string[], expectedType: string } {
  if (typeof value === "boolean") {
    return { defaultValue: value.toString(), alternatives: [], expectedType: "boolean" }
  }

  if (typeof value === "number") {
    return { defaultValue: value.toString(), alternatives: [], expectedType: "number" }
  }

  const parts = value.split("|").map(part => part.trim())
  return {
    defaultValue: parts[0],
    alternatives: parts.slice(1),
    expectedType: "string"
  }
}

function validateValueType(key: string, existingValue: string, expectedType: string): { isValid: boolean, warning?: string } {
  if (expectedType === "boolean") {
    const validBooleans = ["true", "false"]
    if (!validBooleans.includes(existingValue.toLowerCase())) {
      return {
        isValid: false,
        warning: `⚠️  Warning: ${key} should be a boolean (true/false), but found "${existingValue}"`
      }
    }
  }

  if (expectedType === "number") {
    if (isNaN(Number(existingValue))) {
      return {
        isValid: false,
        warning: `⚠️  Warning: ${key} should be a number, but found "${existingValue}"`
      }
    }
  }

  return { isValid: true }
}

function parseExistingEnvFile(envFilePath: string): { [key: string]: string } {
  const existingEnv: { [key: string]: string } = {}

  if (!fs.existsSync(envFilePath)) {
    return existingEnv
  }

  const content = fs.readFileSync(envFilePath, "utf-8")
  const lines = content.split("\n")

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (trimmedLine && !trimmedLine.startsWith("#")) {
      const equalIndex = trimmedLine.indexOf("=")
      if (equalIndex > 0) {
        const key = trimmedLine.substring(0, equalIndex).trim()
        const value = trimmedLine.substring(equalIndex + 1).trim()
        existingEnv[key] = value
      }
    }
  }

  return existingEnv
}

function generateEnvFile(envModel: EnvModel, existingEnv: { [key: string]: string } = {}): { content: string, warnings: string[] } {
  let envContent = ""
  const warnings: string[] = []

  const sortedKeys = Object.keys(envModel).sort()

  for (const key of sortedKeys) {
    const value = envModel[key]
    const { defaultValue, alternatives, expectedType } = parseEnvValue(value)

    const existingValue = existingEnv[key]
    let valueToUse = existingValue || defaultValue

    if (existingValue) {
      const validation = validateValueType(key, existingValue, expectedType)
      if (!validation.isValid && validation.warning) {
        warnings.push(validation.warning)
        valueToUse = defaultValue
      }
    }

    if (alternatives.length > 0) {
      envContent += `# ${alternatives.join(", ")}\n`
    }

    envContent += `${key}=${valueToUse}\n`
  }

  return {
    content: envContent.trim(),
    warnings
  }
}

function findPackageJson(startDir: string = process.cwd()): string {
  let currentDir = startDir

  while (currentDir !== path.dirname(currentDir)) {
    const packageJsonPath = path.join(currentDir, "package.json")

    if (fs.existsSync(packageJsonPath)) {
      return packageJsonPath
    }

    currentDir = path.dirname(currentDir)
  }

  throw new Error("package.json not found")
}

function main() {
  try {
    const packageJsonPath = findPackageJson()
    const packageDir = path.dirname(packageJsonPath)

    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8")
    const packageJson = JSON.parse(packageJsonContent)

    if (!packageJson.envModel) {
      console.log("No envModel found in package.json")
      process.exit(0)
    }

    const envFilePath = path.join(packageDir, ".env")
    const existingEnv = parseExistingEnvFile(envFilePath)

    const { content: envContent, warnings } = generateEnvFile(packageJson.envModel, existingEnv)

    if (warnings.length > 0) {
      console.log("\nType validation warnings:")
      warnings.forEach(warning => console.log(warning))
      console.log("")
    }

    fs.writeFileSync(envFilePath, envContent)
    console.log(`Generated .env file at: ${envFilePath}`)

  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : "Unknown error")
    process.exit(1)
  }
}

main()
