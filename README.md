# Max's Music Quiz - Frontend

React frontend for the music quiz application.

> This is the frontend. You'll also need the [backend API](https://github.com/razmataz100/maxs-music-quiz-backend) running for it to work.

## Setup

1. **Install prerequisites**
    - Node.js 18+

2. **Clone and install**
   ```bash
   git clone https://github.com/razmataz100/maxs-music-quiz-frontend
   cd maxs-music-quiz-frontend
   npm install
   ```

3. **Configure API URL**
    - Create `.env` file in the root directory
    - Add: `VITE_API_BASE_URL=http://localhost:5000`
    - Or set it when running: `VITE_API_BASE_URL=http://localhost:5000 npm run dev`

4. **Run**
   ```bash
   npm run dev
   ```

   App will be at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Technologies

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS

## Common Issues

- **API connection failed**: Check backend is running
- **CORS errors**: Backend should allow `http://localhost:5173`
- **Port already in use**: Change port in `vite.config.js`
