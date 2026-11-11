# Car Dealership Website (React + Vite + Tailwind + Supabase)

A public showcase for your cars. **Customers never log in.** Only you, the owner, can add, edit, discount or mark cars as sold, from a secret portal. Everything is stored in a real online database (Supabase, free plan), so a car you add on your laptop appears for every customer on their phones straight away.

---

## A. One-time setup (about 15 minutes)

### 1. Create the free database
1. Go to **supabase.com**, sign up, click **New project**.
2. Name it, choose a database password (save it), and pick the region closest to you (for example **South Africa (Cape Town)**). Click **Create new project** and wait about 2 minutes.

### 2. Create the tables, photo storage and security rules
1. In Supabase, open **SQL Editor** > **New query**.
2. Open the file `supabase/schema.sql` from this project, copy everything, paste it in, and click **Run**. You should see "Success".
3. This also adds your 14 flyer cars as starter listings.

### 3. Create YOUR owner account (and lock out everyone else)
1. Go to **Authentication** > **Users** > **Add user** > **Create new user**. Enter your email and a strong password. Tick **Auto Confirm User**.
2. Go to **Authentication** > **Sign In / Providers** (or **Settings**) and **turn OFF "Allow new users to sign up"**. This is important: it makes sure you are the only person who can ever sign in.

### 4. Copy your keys
1. Go to **Project Settings** > **API** (or **API Keys**).
2. Copy the **Project URL** and the **anon public** key.

### 5. Connect the website
1. In this project folder, copy `.env.example` and name the copy `.env`.
2. Fill it in:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_ADMIN_PATH=pick-a-long-secret-word-like-gb-owner-7f3k29xq
   ```
3. `VITE_ADMIN_PATH` is the secret address of your owner portal. Choose something long that only you know.

### 6. Run it
```bash
npm install
npm run dev
```
Open `http://localhost:5173`. Your owner portal is at `http://localhost:5173/` + your secret path.

---

## B. Using the owner portal
Go to `yourwebsite.com/your-secret-path` and sign in with the email and password from step 3. Nothing on the public website links to it. Bookmark it.

- **Add car:** fill in make, model, year, mileage, price and description, and drop in as many photos as you like (the first is the main photo; click "Make main" to change it).
- **Discount:** tick "Put this car on discount" and type a percentage or the new price. Customers see the old price crossed out and the new price in red.
- **Mark as sold:** one click in the Vehicles list. The car stays on the site with a big SOLD overlay (sold cars sort to the bottom). Click again to make it available.
- **Settings:** logo, name, phone numbers, WhatsApp number, email, address, opening hours, social links.

## C. Put it online with Netlify
1. Push this project to GitHub.
2. In Netlify: **Add new site** > **Import from Git**. Build command `npm run build`, publish directory `dist` (already set in `netlify.toml`).
3. **Very important:** in Netlify go to **Site configuration** > **Environment variables** and add the same three variables from your `.env` file (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_PATH`). Then redeploy. Without them the live site shows a "connect the database" message.
4. Add your custom domain under **Domain management**. HTTPS is automatic.

## D. How it is secured
- The anon key in the website is public by design. The database rules (Row Level Security in `schema.sql`) let **anyone read** cars, but only the **signed-in owner write** anything (cars, photos, settings).
- Visitors are never asked to sign in, and the site stores no visitor accounts, favourites or tracking.
- The secret address stops people finding the portal, but the real protection is your Supabase password. Use a strong one.
- Keep sign-ups turned off in Supabase (step 3.2).

## E. Good to know
- **Free plan pause:** Supabase pauses free projects after about a week with no activity. If the site ever shows "could not load the latest cars", open your Supabase dashboard and click **Restore project**. A weekly visit to the site avoids this, or upgrade to a paid plan for a real business.
- **Free storage limit:** about 1 GB of photos and 500 MB of database. That is hundreds of cars.
- **Back up** by exporting the `vehicles` table from Supabase (Table Editor > Export) once in a while.
- **Rates in the top bar** come from a free public exchange-rate service and show "offline" if unavailable.

## Change the colours
Edit the four `--color-accent-*` lines at the top of `src/index.css`.
