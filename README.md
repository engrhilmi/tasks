# Master Task Suite: self-hosting guide

You need two free services:

- **Firebase** (Google) stores your tasks and handles sign-in, so the same register shows on your phone and laptop.
- **GitHub Pages** hosts the app at a web address such as `https://yourname.github.io/tasks/`.

Setup takes about 20 minutes and costs nothing. The free Firebase plan (Spark) allows 50,000 reads and 20,000 writes a day, far more than one register needs.

## What is in this folder

| File | Purpose |
|---|---|
| `index.html` | The app |
| `firebase-config.js` | Connects the app to your Firebase project (you edit this in step 1) |
| `firestore.rules` | Security rules: only you can read or write your tasks |
| `manifest.webmanifest`, `icons/` | Home-screen app icon on iPhone and Android |
| `sw.js` | Lets the app open and work without internet; changes sync when you're back online |

---

## Step 1: Create the Firebase project

1. Go to <https://console.firebase.google.com> and sign in with a Google account.
2. Click **Create a project**, name it (for example `master-tasks`) and continue. You can turn Google Analytics off.
3. **Turn on sign-in:** in the left menu open **Build → Authentication → Get started**. Under **Sign-in method**, choose **Email/Password**, switch on the first toggle and click **Save**.
4. **Create the database:** open **Build → Firestore Database → Create database**.
   - Location: `asia-south1 (Mumbai)`, the closest region to Pakistan. You cannot change this later.
   - Start in **production mode**.
5. **Set the security rules:** in Firestore, open the **Rules** tab and delete what is there. Paste the contents of `firestore.rules` and replace `you@example.com` with the email you will sign in with. Click **Publish**.
6. **Get your config:**
   - Click the gear icon → **Project settings**.
   - Under **Your apps**, click the web icon `</>`, give it a nickname and click **Register app**. You don't need Firebase Hosting.
   - Firebase shows a `firebaseConfig = { ... }` block. Copy the six values into `firebase-config.js`, replacing the placeholder values, and save the file.

## Step 2: Put the app online with GitHub Pages

1. Create a free account at <https://github.com>.
2. Click **+ → New repository**, name it `tasks`, set it to **Public** and click **Create repository**.
   - Free GitHub Pages needs a public repository. Only the app's code is public. Your tasks live in Firebase behind your password.
   - The values in `firebase-config.js` are designed to be public. Firebase's own documentation says so.
3. On the repository page, click **uploading an existing file**. Drag in everything in this folder, including the `icons` folder, and click **Commit changes**.
4. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and click **Save**.
5. Wait about a minute. Your address appears at the top of that page, for example `https://yourname.github.io/tasks/`.

**Easier option without GitHub:** go to <https://app.netlify.com/drop>, sign up, and drag this whole folder onto the page. You get an address like `https://something.netlify.app`. To update the app later, drag the folder in again under **Deploys**.

## Step 3: Allow your web address in Firebase

In Firebase, go to **Authentication → Settings → Authorized domains → Add domain**. Enter your site's domain: `yourname.github.io`, or `something.netlify.app` if you used Netlify.

## Step 4: First sign-in, then lock the door

1. Open your web address, tap **Create account**, and use the same email you put in the rules.
2. Back in Firebase, go to **Authentication → Settings → User actions** and untick **Enable create (sign-up)**, so nobody else can create accounts.
   - Even if this option isn't shown for your project, the email check in your rules already blocks everyone else from your data.

## Step 5: Put it on your phone

- **iPhone:** open the address in **Safari**, tap **Share → Add to Home Screen**. It opens full-screen like an app.
- **Android:** open it in Chrome, then tap **⋮ → Add to Home screen** (or **Install app**).
- Sign in once on each device. All devices then show the same tasks and update within seconds.

## Moving your existing tasks across

- **From your current HTML file:** open it, go to **⋯ → Sync & backup → Download backup**. On the hosted site, go to **⋯ → Sync & backup → Restore**, pick that file, and choose **Merge**.
- **From old Word daily updates:** use **Import Word** on the hosted site.

## Updating the app later

Replace `index.html` in your GitHub repository (**Add file → Upload files**) or redeploy on Netlify. Your tasks are not affected; they stay in Firebase.

## Good to know

- **Backups:** download one from **Sync & backup** now and then. Firebase is reliable, but a backup file costs nothing.
- **Other staff:** to let another officer keep their own private register, add their email to the list in `firestore.rules`. Then switch sign-up back on while they create their account. Each person sees only their own tasks.
- **Forgot password:** use **Forgot password?** on the sign-in screen. Firebase emails you a reset link.
- **Something isn't working:**
  - "Not allowed to save" means the email in `firestore.rules` doesn't match the one you signed in with.
  - "This web address is not authorised" means step 3 is missing.
