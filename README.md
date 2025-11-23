# 🚀 Mandate

> **STOP THE ENVIRONMENTAL MADNESS.** Stop playing games with your .env files. Stop gambling with your deployment sanity.

## 🔥 THE PAIN IS REAL (AND YOU KNOW IT)

### ❌ The .env.example Disaster
You track `.env.example` and pray your team remembers to add new variables. Good luck finding out when someone adds `REDIS_PASSWORD` to the codebase but forgets to update the example. You're playing Russian roulette with your production deployments.

### ❌ The .env + .env.local Nightmare
You commit `.env` with "default values" and tell everyone to use `.env.local` for overrides. Right. What happens when:

* **Dev adds `NEW_FEATURE=true` to `.env.local` → pushes to production → CRASHES** because production doesn't have it
* **Senior dev adds real production values to "default" `.env` → SECURITY BREACH** because secrets are now in git
* **Default changes from `DEBUG=false` to `DEBUG="verbose"`** → Type mismatch breaks everyone's `.env.local`
* **Variable gets removed from defaults** → You're completely screwed wondering why your app won't start

### ❌ The Type Safety Catastrophe
`DATABASE_TIMEOUT=30` becomes `DATABASE_TIMEOUT="thirty"` in a pull request. Your Node.js app throws `NaN` errors and you spend 3 hours debugging why your database connections are failing.

### ❌ The Documentation Black Hole
New variables appear. Documentation doesn't. Team members guess acceptable values. Production burns. rinse. repeat.

## 💥 THE SOLUTION THAT ACTUALLY WORKS

**Mandate** is the **NO-EXCUSES** environment manager that eliminates ALL the bullshit.

### ✅ **Single Source of Truth**
Your `package.json` becomes your **CONTRACT**. All variables, types, and alternatives live in one place. No more guessing games.

### ✅ **Type Safety That Saves Your Ass**
- **Boolean?** `true`/`false` ONLY. No "yes", "no", "1", "0" bullshit
- **Number?** Must be numeric. No "thirty" when you expect 30
- **String with alternatives?** `localhost|127.0.0.1|0.0.0.0` → Clear options in comments

### ✅ **Never Override Developer Values**
Your existing `.env` values are **SACRED**. We only step in when you're using the wrong type or the variable doesn't exist.

### ✅ **Alphabetical Order = Sanity**
Variables appear A-Z every time. No more hunting for that one setting buried in the middle.

### ✅ **Zero Friction Setup**
One command. One npm script. Zero excuses.

## 📦 INSTALLATION (BECAUSE YOU'RE BUSY)

```bash
npm install mandate-env --save-dev
```

Add this to your `package.json`:

```json
{
  "scripts": {
    "env:generate": "env-manager"
  },
  "dependencies": {
    "mandate-env": "*"
  }
}
```

## 🎯 HOW IT WORKS (STUPID SIMPLE)

### 1. Define Your Environment Contract

```json
{
  "envModel": {
    "PORT": 3000,
    "HOST": "localhost|127.0.0.1|0.0.0.0",
    "DATABASE_URL": "postgresql://localhost:5432/myapp",
    "REDIS_ENABLED": true,
    "MAX_CONNECTIONS": 100,
    "LOG_LEVEL": "info|debug|warn|error"
  }
}
```

### 2. Generate Your .env

```bash
npm run env:generate
```

### 3. Get This Result

```env
# 127.0.0.1, 0.0.0.0
HOST=localhost

LOG_LEVEL=info|debug|warn|error

MAX_CONNECTIONS=100

REDIS_ENABLED=true
```

**Type Validation Warnings:**
⚠️ Warning: REDIS_ENABLED should be a boolean (true/false), but found "yes"
→ **We fix it automatically and restore the default**

## 🚨 FEATURES THAT ACTUALLY MATTER

- **🔒 Type Validation:** Catches boolean/number/string mismatches
- **💾 Value Preservation:** Never overwrites your existing settings
- **📋 Alternatives Documentation:** Shows all valid options as comments
- **🔤 Alphabetical Ordering:** Consistent, predictable output
- **⚡ Lightning Fast:** Runs in milliseconds
- **🛡️ Zero Configuration:** Works out of the box

## 🎪 REAL-WORLD EXAMPLES

### **Example 1: Development vs Production**

```json
"envModel": {
  "NODE_ENV": "development|production|test",
  "API_URL": "http://localhost:3000|https://api.yourapp.com",
  "DATABASE_SSL": false
}
```

```env
# development, production, test
NODE_ENV=development

# http://localhost:3000, https://api.yourapp.com
API_URL=http://localhost:3000

DATABASE_SSL=false
```

### **Example 2: Service Configuration**

```json
"envModel": {
  "REDIS_HOST": "localhost|127.0.0.1|redis-cluster",
  "REDIS_PORT": 6379,
  "REDIS_PASSWORD": "",
  "CACHE_TTL": 3600,
  "CACHE_ENABLED": true
}
```

## 🔥 THE BOTTOM LINE

Stop wasting hours on environment configuration issues. Stop playing deployment roulette. Start treating your environment variables like the **CRITICAL INFRASTRUCTURE** they are.

**@vibenv/env-manager** isn't just another tool. It's your **insurance policy** against the chaos that destroys teams and ruins deployments.

## 📊 BEFORE vs AFTER

| 🤮 BEFORE | 😎 AFTER |
|-----------|----------|
| 3 hours debugging type issues | 0 seconds - automatic validation |
| Manual documentation updates | Built-in alternatives documentation |
| Production secrets in git | Type-safe defaults only |
| "Works on my machine" problems | Consistent environments everywhere |
| Team confusion over values | Clear alternatives in comments |

## 🏆 STOP SCREWING AROUND

Your team deserves better than environment variable chaos. Your production environment deserves better than surprise crashes.

**Install it now.** Thank yourself later.

```bash
npm install mandate-env
```

---

*Made with ❤️ by developers who have suffered enough environment variable hell.*