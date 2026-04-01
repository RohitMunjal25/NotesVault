📝 NotesVaultThe Ultimate Secure Workspace for Your Thoughts 🚀⚡ Project OverviewNotesVault is a high-performance, full-stack web application designed for people who value speed and security. Whether it's a quick idea or a detailed plan, NotesVault captures it instantly in a sleek, distraction-free environment."Your second brain, but more secure." 🔥🛡️ Key HighlightsUnbreakable SecurityJWT Authentication: Industry-standard secure sessions.OTP Verification: Double-layer protection with 6-digit email codes via Nodemailer.Password Recovery: Secure password reset flow using one-time passcodes.User ExperienceSmart Pinning: Keep your most important tasks at the top with a single click.Masonry Grid: A modern, Pinterest-style layout that adapts to your note length.Instant Search: Optimized search bar that filters your vault in real-time.Hard Delete: No clutter, no trash—just permanent, one-click cleaning.🛠️ Tech StackLayerTechnologyFrontendHTML5, CSS3, JavaScript (Vanilla)BackendNode.js, Express.jsDatabaseMongoDB (Mongoose)SecurityJSON Web Tokens (JWT), Nodemailer📂 Project StructureBashNotesVault/
├── 🧠 backend/             # Server, Auth & Database Logic
│   ├── middleware/         # Security layers
│   ├── models/             # Mongoose Data Schemas
│   └── routes/             # API Endpoints
└── 🎨 frontend/            # The UI & Client-side logic
    ├── auth.js             # Authentication flow
    └── dashboard.js        # Note management & UI logic
⚙️ Installation1. Clone the VaultBashgit clone https://github.com/rohitmunjal/NotesVault.git
2. Backend SetupGo to cd backend and run npm install.Setup your .env with MONGO_URI, JWT_SECRET, and Email credentials.Run npm start.3. Frontend LaunchConnect your API in dashboard.js.Open index.html with Live Server.