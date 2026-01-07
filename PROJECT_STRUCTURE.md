# 📁 CẤU TRÚC THƯ MỤC DỰ ÁN - MUSIC PLAYER APP

## 🌳 Cây thư mục đầy đủ

```
music-player-app/
│
├── 📄 .gitignore                          # Git ignore rules
│
├── 📄 PROJECT_EVALUATION.md               # Đánh giá toàn diện dự án
├── 📄 DEVELOPMENT_ROADMAP.md               # Lộ trình phát triển
├── 📄 PROJECT_STRUCTURE.md                # File này - Cấu trúc thư mục
│
├── 📂 backend/                            # Backend Server (Node.js/Express)
│   │
│   ├── 📄 index.js                        # Entry point của backend server
│   ├── 📄 db.js                           # Database connection (MongoDB)
│   ├── 📄 createUser.js                  # Script tạo user (utility)
│   ├── 📄 test-mongo.js                  # Script test MongoDB connection
│   │
│   ├── 📄 package.json                    # Dependencies và scripts
│   ├── 📄 package-lock.json              # Lock file cho dependencies
│   ├── 📄 README.md                       # Backend documentation
│   │
│   ├── 📄 Dockerfile                      # Docker configuration cho backend
│   ├── 📄 docker-compose.yml             # Docker Compose configuration
│   │
│   ├── 📂 middleware/                     # Express middleware
│   │   ├── 📄 checkApiKey.js              # Middleware kiểm tra YouTube API key
│   │   └── 📄 checkToken.js               # Middleware kiểm tra Spotify token
│   │
│   ├── 📂 models/                         # Mongoose models (Database schemas)
│   │   ├── 📄 User.js                     # User model (username, password)
│   │   ├── 📄 CustomPlaylist.js          # Playlist model
│   │   ├── 📄 SearchHistory.js            # Search history model
│   │   └── 📄 Token.js                    # Spotify token model
│   │
│   ├── 📂 routes/                         # API routes
│   │   ├── 📄 api.js                      # Main API routes (search, video, playlist)
│   │   ├── 📄 auth.js                     # Authentication routes (login, register)
│   │   └── 📄 public.js                   # Public routes
│   │
│   └── 📂 node_modules/                   # Backend dependencies (gitignored)
│
│
└── 📂 frontend/                           # Frontend Application (React)
    │
    ├── 📄 package.json                    # Frontend dependencies và scripts
    ├── 📄 package-lock.json              # Lock file cho dependencies
    ├── 📄 README.md                       # Frontend documentation
    ├── 📄 tsconfig.json                   # TypeScript config (nếu dùng TS)
    │
    ├── 📂 public/                         # Static files (public assets)
    │   ├── 📄 index.html                  # HTML template
    │   ├── 📄 favicon.ico                 # Favicon
    │   ├── 📄 manifest.json               # PWA manifest
    │   ├── 📄 robots.txt                  # SEO robots file
    │   ├── 📄 logo192.png                 # Logo 192x192
    │   └── 📄 logo512.png                 # Logo 512x512
    │
    ├── 📂 build/                          # Production build (generated)
    │   ├── 📄 index.html
    │   ├── 📄 asset-manifest.json
    │   ├── 📄 manifest.json
    │   ├── 📄 robots.txt
    │   ├── 📄 favicon.ico
    │   ├── 📄 logo192.png
    │   ├── 📄 logo512.png
    │   │
    │   └── 📂 static/                     # Compiled static assets
    │       ├── 📂 css/                    # Compiled CSS files
    │       │   ├── 📄 main.[hash].css
    │       │   └── 📄 main.[hash].css.map
    │       │
    │       ├── 📂 js/                     # Compiled JavaScript bundles
    │       │   ├── 📄 main.[hash].js
    │       │   ├── 📄 main.[hash].js.map
    │       │   ├── 📄 453.[hash].chunk.js
    │       │   ├── 📄 453.[hash].chunk.js.map
    │       │   ├── 📄 reactPlayerPreview.[hash].chunk.js
    │       │   └── 📄 reactPlayerPreview.[hash].chunk.js.map
    │       │
    │       └── 📂 media/                  # Optimized media files
    │           └── 📄 login.[hash].png
    │
    ├── 📂 src/                            # Source code
    │   │
    │   ├── 📄 index.js                    # React entry point
    │   ├── 📄 index.css                   # Global styles
    │   ├── 📄 App.js                      # Main App component (routing)
    │   ├── 📄 App.css                     # App component styles
    │   ├── 📄 App.test.js                 # App component tests
    │   │
    │   ├── 📄 MainApp.js                  # Main application component
    │   │
    │   ├── 📄 AuthContext.js              # Authentication context (React Context)
    │   ├── 📄 PlaylistContext.js          # Playlist context (React Context)
    │   │
    │   ├── 📄 setupTests.js               # Test setup configuration
    │   ├── 📄 reportWebVitals.js          # Web vitals reporting
    │   ├── 📄 logo.svg                    # Logo SVG
    │   │
    │   ├── 📂 api/                        # API service layer
    │   │   ├── 📄 auth.js                 # Authentication API calls
    │   │   └── 📄 songs.js                # Songs/Video API calls
    │   │
    │   ├── 📂 components/                 # React components
    │   │   │
    │   │   ├── 📄 LandingPage.js          # Landing/Home page component
    │   │   ├── 📄 HomePage.js             # Main home page
    │   │   ├── 📄 SignUpPage.js           # Sign up/Register page
    │   │   ├── 📄 PlayerPage.js           # Video player page
    │   │   │
    │   │   ├── 📄 Search.js               # Search component
    │   │   ├── 📄 Player.js               # Video player component
    │   │   ├── 📄 CustomPlaylists.js      # Playlist management component
    │   │   ├── 📄 SharedPlaylist.js       # Shared playlist view
    │   │   ├── 📄 Recommendations.js      # Video recommendations
    │   │   │
    │   │   ├── 📄 LeftSection.js          # Left sidebar component
    │   │   ├── 📄 LogoutButton.js        # Logout button component
    │   │   ├── 📄 Background3D.js        # 3D background effect
    │   │   │
    │   │   └── 📂 particles/              # Particle effects components
    │   │       ├── 📄 effect.js           # Particle effect logic
    │   │       └── 📄 SocialIcons.js      # Social icons component
    │   │
    │   ├── 📂 assets/                     # Static assets
    │   │   │
    │   │   ├── 📂 css/                    # Component-specific CSS
    │   │   │   ├── 📄 HomePage.css
    │   │   │   ├── 📄 LandingPage.css
    │   │   │   └── 📄 Search.css
    │   │   │
    │   │   ├── 📂 images/                 # Image assets
    │   │   │   ├── 📄 logo.png
    │   │   │   ├── 📄 logo_1.png
    │   │   │   └── 📄 login.png
    │   │   │
    │   │   ├── 📄 login.png               # Login image (duplicate)
    │   │   ├── 📄 logo.png                # Logo (duplicate)
    │   │   ├── 📄 logo_1.png             # Logo variant (duplicate)
    │   │   ├── 📄 main.png                # Main image
    │   │   │
    │   │   └── 📂 Sliders/                # Slider images
    │   │       ├── 📄 Sliders_1.png
    │   │       ├── 📄 Sliders_2.png
    │   │       ├── 📄 Sliders_3.png
    │   │       ├── 📄 Sliders_4.png
    │   │       ├── 📄 Sliders_5.png
    │   │       ├── 📄 Sliders_6.png
    │   │       └── 📄 Sliders_7.png
    │   │
    │   └── 📂 utils/                       # Utility functions
    │       └── 📄 spotify-sdk.js          # Spotify SDK utilities
    │
    └── 📂 node_modules/                   # Frontend dependencies (gitignored)
```

---

## 📋 Mô tả các thư mục chính

### 🎯 **Root Directory**
- **`.gitignore`**: Các file/folder không được commit lên Git
- **Documentation files**: Các file đánh giá và roadmap

### 🔧 **Backend (`/backend`)**

#### Core Files
- **`index.js`**: Entry point, khởi tạo Express server, setup middleware và routes
- **`db.js`**: Kết nối MongoDB database
- **`package.json`**: Dependencies và scripts (nodemon, express, mongoose, etc.)

#### Middleware (`/middleware`)
- **`checkApiKey.js`**: Kiểm tra YouTube API key có tồn tại
- **`checkToken.js`**: Kiểm tra và refresh Spotify token

#### Models (`/models`)
- **`User.js`**: Schema cho user (username, hashed password)
- **`CustomPlaylist.js`**: Schema cho playlist (name, videos array, userId)
- **`SearchHistory.js`**: Schema cho lịch sử tìm kiếm
- **`Token.js`**: Schema cho Spotify tokens

#### Routes (`/routes`)
- **`api.js`**: Main API endpoints (search, video info, playlist CRUD, recommendations)
- **`auth.js`**: Authentication endpoints (login, register)
- **`public.js`**: Public routes (shared playlists)

#### Docker
- **`Dockerfile`**: Container configuration cho backend
- **`docker-compose.yml`**: Multi-container setup

---

### 🎨 **Frontend (`/frontend`)**

#### Core Files
- **`src/index.js`**: React entry point, render App component
- **`src/App.js`**: Main routing component (React Router)
- **`src/MainApp.js`**: Main application logic và state management

#### Context (`/src`)
- **`AuthContext.js`**: Authentication state management (login, logout, user)
- **`PlaylistContext.js`**: Playlist refresh trigger management

#### Components (`/src/components`)
- **Pages**: `LandingPage.js`, `HomePage.js`, `SignUpPage.js`, `PlayerPage.js`
- **Features**: `Search.js`, `Player.js`, `CustomPlaylists.js`, `Recommendations.js`
- **UI**: `LeftSection.js`, `LogoutButton.js`, `Background3D.js`
- **Effects**: `particles/` - Particle animation effects

#### API Layer (`/src/api`)
- **`auth.js`**: Authentication API calls
- **`songs.js`**: Video/song API calls

#### Assets (`/src/assets`)
- **`css/`**: Component-specific stylesheets
- **`images/`**: Image assets (logos, backgrounds)
- **`Sliders/`**: Slider/carousel images

#### Utils (`/src/utils`)
- **`spotify-sdk.js`**: Spotify SDK utilities (nếu có tích hợp Spotify)

#### Public (`/public`)
- Static files được serve trực tiếp
- `index.html`: HTML template
- Icons và manifest files

#### Build (`/build`)
- Production build được generate bởi `npm run build`
- Optimized và minified code
- **Lưu ý**: Folder này được gitignored, chỉ có khi build

---

## 🔍 File quan trọng cần chú ý

### ⚠️ Files cần sửa (theo đánh giá)
1. **`frontend/src/AuthContext.js`** - Lỗi syntax trong login function
2. **`frontend/src/MainApp.js`** - Typo `@ketframes` → `@keyframes`
3. **`backend/middleware/checkToken.js`** - Dấu chấm phẩy thừa
4. **`backend/models/CustomPlaylist.js`** - Thiếu `userId` field
5. **`backend/routes/api.js`** - Thiếu JWT authentication middleware

### ✅ Files quan trọng
1. **`backend/index.js`** - Server configuration
2. **`frontend/src/App.js`** - Routing configuration
3. **`backend/db.js`** - Database connection
4. **`frontend/src/AuthContext.js`** - Authentication logic
5. **`backend/routes/api.js`** - Main API endpoints

---

## 📊 Thống kê

- **Total files**: ~50+ source files
- **Backend routes**: 3 route files
- **Backend models**: 4 Mongoose models
- **Frontend components**: 13+ React components
- **API endpoints**: ~15+ endpoints

---

## 🚀 Cách sử dụng

### Backend
```bash
cd backend
npm install
npm start  # Chạy với nodemon
```

### Frontend
```bash
cd frontend
npm install
npm start  # Chạy development server (port 6704)
npm build  # Build production
```

---

## 📝 Ghi chú

- **`node_modules/`**: Được gitignored, cài đặt bằng `npm install`
- **`build/`**: Được gitignored, generate bằng `npm run build`
- **`.env`**: Được gitignored, cần tạo file này với environment variables
- **`package-lock.json`**: Nên commit để đảm bảo version consistency

---

*Cập nhật lần cuối: $(date)*

