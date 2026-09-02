# Love Calculator

Animated name-based love calculator with a private password-protected admin page.

## Run locally
1. Install Node.js 18+.
2. In this folder run `npm install`.
3. Set two environment variables: `ADMIN_PASSWORD` and a long random `SESSION_SECRET`.
4. Run `npm start`.
5. Open `http://localhost:3000`.
6. Admin page: `http://localhost:3000/admin`.

The app stores entered names in `love.db`. Visitors are shown a notice before submitting names. Do not publish this publicly without appropriate privacy/security measures and a clear privacy notice.
