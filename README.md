# BillCraft — Full-Stack Billing Software

**Tech Stack:** React + TypeScript + Vite + TanStack Router | Node.js + Express + TypeScript + MongoDB Atlas

---

## Quick Start

```bash
# Terminal 1 — Backend
cd backend
npm install
cp .env.example .env       ← fill in your MongoDB URI and JWT secret (see below)
npm run dev                → http://localhost:4000

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev                → http://localhost:5173
```

---

## 🍃 MongoDB Atlas Setup (Step-by-Step)

### Step 1 — Create a free Atlas account
1. Go to **https://cloud.mongodb.com**
2. Click **"Try Free"** → sign up with Google or email
3. Choose the **Free (M0)** tier when asked about deployment

### Step 2 — Create a Cluster
1. After login, click **"Build a Database"**
2. Select **M0 FREE** tier
3. Choose a cloud provider (AWS / Google Cloud) and region closest to you
4. Give your cluster a name (e.g. `billcraft-cluster`) → click **"Create"**
5. Wait 1–3 minutes for cluster to be created

### Step 3 — Create a Database User
1. In the left sidebar click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set a **username** (e.g. `billcraft_user`) and a strong **password**
5. Under "Built-in Role" select **"Atlas Admin"** (or "Read and write to any database")
6. Click **"Add User"**

> 🔑 Save this username and password — you need them in Step 5

### Step 4 — Allow Network Access (IP Whitelist)
1. In the left sidebar click **"Network Access"**
2. Click **"Add IP Address"**
3. For development: click **"Allow Access From Anywhere"** → this adds `0.0.0.0/0`
4. Click **"Confirm"**

> ⚠️ For production, restrict to your server's specific IP address

### Step 5 — Get Your Connection String
1. In the left sidebar click **"Database"** (under Deployment)
2. Click the **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select **Driver: Node.js**, Version: **5.5 or later**
5. Copy the connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@billcraft-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` with your database username from Step 3
7. Replace `<password>` with your database password from Step 3
8. Add the database name before `?`:
   ```
   mongodb+srv://billcraft_user:yourpassword@billcraft-cluster.xxxxx.mongodb.net/billcraft?retryWrites=true&w=majority
   ```

### Step 6 — Put the Connection String in .env
Open `backend/.env` and set:
```env
MONGODB_URI=mongodb+srv://billcraft_user:yourpassword@billcraft-cluster.xxxxx.mongodb.net/billcraft?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_here_min_32_chars
PORT=4000
FRONTEND_URL=http://localhost:5173
```

### Step 7 — Start the backend
```bash
cd backend
npm run dev
```

You should see:
```
✅  Connected to MongoDB Atlas
🚀  BillCraft API running → http://localhost:4000
```

---

## 📁 Database Collections (MongoDB)

MongoDB will automatically create these collections in the `billcraft` database:

| Collection | What it stores |
|-----------|----------------|
| `users`    | Vendor accounts — uniqueId, name, email, mobile, shopName, gstNo, address, passwordHash |
| `products` | Inventory items per vendor — name, price, quantity, unit, hsn |
| `bills`    | Saved invoices per vendor — bill items, customer details, tax amounts |

All data is **scoped per vendor** using the `userId` field (the VND-XXXXXX vendor ID).

---

## 🔒 Registration Rules (Unique Fields)

The following fields **must be unique** across all users:
- **Email** — one account per email address
- **Mobile number** — one account per phone number
- **GST No** — one account per GST number (if provided)
- **Vendor ID** — auto-generated, always unique

If you try to register with a duplicate value, you will get a clear error message.

---

## 🔑 Login
Login uses your **Vendor ID** (e.g. `VND-AB3X9Z`) + **password**.
The Vendor ID is shown after successful registration — save it!

---

## 📊 Excel Export
Click the **"Export Excel"** button in the dashboard header to download a `.xlsx` file with:
- **Sheet 1 — My Profile**: your account and shop details
- **Sheet 2 — My Inventory**: all your products
- **Sheet 3 — Bills Export**: all bills with full item details

To enable Excel export, install the xlsx package:
```bash
cd backend
npm install xlsx
```

---

## 📋 API Endpoints

### Auth (`/api/auth`)
| Method | Path        | Description           | Auth |
|--------|-------------|-----------------------|------|
| POST   | /register   | Register new vendor   | ❌   |
| POST   | /login      | Login, get JWT token  | ❌   |
| GET    | /me         | Get current profile   | ✅   |
| PUT    | /profile    | Update profile        | ✅   |

### Products (`/api/products`)
| Method | Path    | Description      | Auth |
|--------|---------|------------------|------|
| GET    | /       | List products    | ✅   |
| POST   | /       | Add product      | ✅   |
| PUT    | /:id    | Update product   | ✅   |
| DELETE | /:id    | Delete product   | ✅   |

### Bills (`/api/bills`)
| Method | Path      | Description               | Auth |
|--------|-----------|---------------------------|------|
| GET    | /         | List bills                | ✅   |
| POST   | /         | Save bill                 | ✅   |
| GET    | /stats    | Today's sales & counts    | ✅   |
| GET    | /export   | Download Excel report     | ✅   |
| GET    | /:id      | Get single bill           | ✅   |

---

## 🏗️ Production Deployment

1. Build backend: `cd backend && npm run build`
2. Set `NODE_ENV=production` in your server environment
3. Set a strong `JWT_SECRET` (32+ random characters)
4. Restrict MongoDB Atlas IP whitelist to your server's IP
5. Set `FRONTEND_URL` to your actual domain
6. Run: `node dist/index.js`

---

## 📁 Project Structure

```
billcraft/
├── frontend/
│   └── src/
│       ├── api/          ← axios API client + service functions
│       ├── components/   ← auth, dashboard, layout, ui components
│       ├── lib/          ← store (context), types, invoice PDF, utils
│       └── routes/       ← TanStack Router pages
│
└── backend/
    └── src/
        ├── models/       ← Mongoose schemas (User, Product, Bill)
        ├── routes/       ← Express route handlers
        ├── middleware/   ← JWT auth middleware
        ├── db.ts         ← MongoDB Atlas connection
        └── index.ts      ← Server entry point
```
