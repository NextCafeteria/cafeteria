<p align="center">
  <img alt="Cafeteria" style="width: 128px; max-width: 100%; height: auto;" src="./public/images/icons/icon-128x128.png"/>
  <h1 align="center">☕ Cafeteria App ☕</h1>
  <p align="center" style="font-weight: bold">Online ordering system for small coffee shops!</p>
</p>

<img align="center" alt="Cafeteria" style="max-width: 500px; height: auto;" src="https://github.com/NextCafeteria/cafeteria/assets/18329471/a6c632f4-26ab-4aab-a75a-94b31bfa74f6"/>

- **Deployed at:** [https://cafe.vietanh.dev/](https://cafe.vietanh.dev/).
- **Frontend:** Next.js with Javascript, Tailwind CSS.
- **Database:** Google Firebase.
- **Authentication:** NextAuth.js with Google OAuth.
- **Deployment:** Vercel.
- **Developers:**
  - [Nguyen Viet Anh](https://github.com/vietanhdev).
  - [Trinh Thu Hai](https://github.com/haitt00).

## 1. Design

**UI Design:** [Open in Figma](https://www.figma.com/file/NWU9BqtgXH4WZmBuEWUlVH/Cafeteria?type=design&node-id=0%3A1&t=2CNfDxghbK04aOCP-1)

## 2. Getting Started

Copy `.env.example` to `.env` and fill in the environment variables.

- `FIREBASE*`: Firebase config. See [here](https://firebase.google.com/docs/web/setup#config-object).
- `NEXT_PUBLIC_GOOGLE_LOGIN`, `GOOGLE_ID`, `GOOGLE_SECRET`: Google OAuth config. See [here](https://next-auth.js.org/providers/google).
- `NEXT_PUBLIC_GITHUB_LOGIN`, `GITHUB_ID`, `GITHUB_SECRET`: Github OAuth config. See [here](https://next-auth.js.org/providers/github).

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 3. Deployment

### 3.1. Local build and check

Build the app:

```bash
npm run build
```

Start the app:

```bash
npm run start
```

### 3.2. Deploy to Vercel

- Create a new project on [Vercel](https://vercel.com/).
- Add all environment variables to the project (see [.env.sample](.env.sample)).
- Deploy the app.
