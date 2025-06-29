# 🔧 Environment Variables Guide

## What are Environment Variables?

Environment variables are like **secret settings** that your application uses to work properly. Think of them as configuration files that contain sensitive information you don't want to share in your code.

## 🎯 Why Use Environment Variables?

### ✅ **Security**
- Keep passwords and API keys secret
- Don't expose sensitive data in your code
- Different secrets for different environments

### ✅ **Flexibility**
- Change settings without changing code
- Different configurations for development vs production
- Easy to manage across different servers

### ✅ **Best Practices**
- Industry standard for configuration management
- Required for cloud deployment
- Essential for team collaboration

## 📋 Environment Variables in OTID-FAN

Your project uses these environment variables:

### 1. **MONGODB_URI** (Database Connection)
```bash
# Development (Local)
MONGODB_URI=mongodb://localhost:27017/otid-fan

# Production (MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/otid-fan?retryWrites=true&w=majority
```

**What it does:** Tells your app how to connect to the database

### 2. **JWT_SECRET** (Authentication Security)
```bash
# Development
JWT_SECRET=my-super-secret-key-123

# Production (Use a strong, random string)
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**What it does:** Used to sign and verify JWT tokens for user authentication

### 3. **PORT** (Server Port)
```bash
# Development
PORT=5000

# Production (Often set by hosting platform)
PORT=3000
```

**What it does:** Tells your server which port to run on

### 4. **NODE_ENV** (Environment Type)
```bash
# Development
NODE_ENV=development

# Production
NODE_ENV=production
```

**What it does:** Tells your app whether it's running in development or production mode

## 🛠️ How to Set Environment Variables

### Method 1: .env File (Local Development)

Create a `.env` file in your project root:

```bash
# .env file
MONGODB_URI=mongodb://localhost:27017/otid-fan
JWT_SECRET=my-super-secret-key-123
PORT=5000
NODE_ENV=development
```

### Method 2: Command Line (Temporary)

```bash
# Windows
set MONGODB_URI=mongodb://localhost:27017/otid-fan

# Mac/Linux
export MONGODB_URI=mongodb://localhost:27017/otid-fan
```

### Method 3: Hosting Platform (Production)

**Vercel Dashboard:**
1. Go to your project settings
2. Click "Environment Variables"
3. Add each variable with its value

**Railway/Render:**
1. Go to project settings
2. Find "Environment Variables" section
3. Add your variables

## 🔍 How Your Code Uses Environment Variables

Look at this code from your `server/index.js`:

```javascript
// Load environment variables from .env file
dotenv.config();

// Use environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/otid-fan';

// Connect to database using the environment variable
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Check if we're in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, '../client/build')));
}
```

## 🚨 Security Best Practices

### ✅ **Do's:**
- Use strong, random JWT secrets
- Keep `.env` files out of git (use `.gitignore`)
- Use different secrets for development and production
- Regularly rotate production secrets

### ❌ **Don'ts:**
- Never commit `.env` files to git
- Don't use simple passwords as secrets
- Don't share environment variables in public repositories
- Don't hardcode secrets in your code

## 📁 File Structure Example

```
OTID-FAN/
├── .env                    # ✅ Environment variables (local)
├── .env.example           # ✅ Template file (safe to commit)
├── .gitignore             # ✅ Excludes .env from git
├── server/
│   └── index.js           # ✅ Uses process.env.MONGODB_URI
└── client/
    └── src/
        └── components/    # ✅ Frontend components
```

## 🔧 Creating Your .env File

1. **Create a `.env` file** in your project root:
   ```bash
   touch .env
   ```

2. **Add your variables:**
   ```bash
   MONGODB_URI=mongodb://localhost:27017/otid-fan
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   NODE_ENV=development
   ```

3. **For production deployment:**
   - Get MongoDB Atlas connection string
   - Generate a strong JWT secret
   - Set `NODE_ENV=production`

## 🎯 Real-World Example

**Development Environment:**
```bash
MONGODB_URI=mongodb://localhost:27017/otid-fan
JWT_SECRET=dev-secret-key-123
PORT=5000
NODE_ENV=development
```

**Production Environment:**
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/otid-fan
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
PORT=3000
NODE_ENV=production
```

## 🚀 Next Steps

1. **Create your `.env` file** for local development
2. **Set up MongoDB Atlas** for production database
3. **Deploy to Vercel** and add environment variables in the dashboard
4. **Test your application** to ensure everything works

Environment variables are essential for modern web development and deployment. They keep your application secure and flexible! 🔐 