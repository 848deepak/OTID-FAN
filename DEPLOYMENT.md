# 🚀 Deployment Guide for OTID-FAN

This guide will help you deploy your OTID-FAN application to the cloud.

## Prerequisites

1. **GitHub Account** ✅ (Already done)
2. **MongoDB Atlas Account** (Free tier available)
3. **Vercel Account** (Free tier available)

## Step 1: Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user with read/write permissions
5. Get your connection string
6. Add your IP address to the IP whitelist (or use 0.0.0.0/0 for all IPs)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository: `848deepak/OTID-FAN`
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run install-all && npm run build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret
   NODE_ENV=production
   ```

6. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts and add your environment variables

## Step 3: Configure Environment Variables

In your Vercel dashboard, add these environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/otid-fan?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
```

## Step 4: Update Frontend API Configuration

After deployment, you'll need to update the API base URL in your frontend. The API will be available at:
`https://your-vercel-app.vercel.app/api`

## Alternative Hosting Options

### Option 2: Netlify + Railway

**Frontend (Netlify):**
1. Go to [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Set build command: `cd client && npm install && npm run build`
4. Set publish directory: `client/build`

**Backend (Railway):**
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Set the root directory to `server/`
4. Add environment variables

### Option 3: Render

1. Go to [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm run install-all`
5. Set start command: `npm start`
6. Add environment variables

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test user login
- [ ] Test identity verification
- [ ] Test fraud reporting
- [ ] Test OTID lookup
- [ ] Verify file uploads work
- [ ] Check MongoDB connection
- [ ] Test face recognition functionality

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your frontend is calling the correct API URL
2. **MongoDB Connection**: Verify your connection string and IP whitelist
3. **File Uploads**: Vercel has limitations on file uploads. Consider using cloud storage
4. **Build Errors**: Check that all dependencies are properly installed

### File Upload Limitations:

Vercel has a 4.5MB payload limit. For production, consider:
- Using AWS S3 or similar for file storage
- Implementing client-side image compression
- Using cloud storage services

## Monitoring and Maintenance

1. Set up monitoring with Vercel Analytics
2. Configure error tracking (Sentry, etc.)
3. Set up automatic deployments from GitHub
4. Monitor MongoDB usage and costs

## Security Considerations

1. Use strong JWT secrets
2. Enable HTTPS (automatic with Vercel)
3. Implement rate limiting
4. Validate all user inputs
5. Use environment variables for sensitive data
6. Regularly update dependencies

## Cost Estimation

**Free Tier (Recommended for MVP):**
- Vercel: Free (100GB bandwidth/month)
- MongoDB Atlas: Free (512MB storage)
- Total: $0/month

**Paid Tier (For production):**
- Vercel Pro: $20/month
- MongoDB Atlas: $9/month
- Total: ~$29/month 