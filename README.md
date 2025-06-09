# =====================================
# 🌳 Forest of Emotions – Frontend Setup
# =====================================

# -------------------------------------
# 📌 About the Project
# -------------------------------------
# Forest of Emotions is an emotional insight dashboard that visualizes 
# email sentiments using a 3D forest metaphor. Each email is analyzed 
# using AI and mapped to one of Plutchik's core emotions like joy, sadness, 
# fear, anger, etc. The frontend is built with React and Three.js to display 
# an immersive, interactive forest where trees represent emotional logs.

# -------------------------------------
# 🧾 Features
# -------------------------------------
# ✅ Email sentiment analysis visualization
# ✅ 3D emotional forest with trees as logs
# ✅ Daily summaries with predominant emotions
# ✅ Toggle between light and dark modes
# ✅ Interactive UI and animations

# -------------------------------------
# 🚀 How to Set Up (Frontend)
# -------------------------------------

# 1. Clone the frontend repository
git clone https://github.com/NitinPSingh/forest-of-emotions.git
cd forest-of-emotions

# 2. Install dependencies
npm install

# 3. Create a `.env` file
echo "VITE_API_URL=http://localhost:3001/api" > .env

# ⚠️ Replace the URL if your backend is hosted elsewhere (e.g. Caddy, EC2, nip.io etc.)

# 4. Run the development server
npm run dev

# -------------------------------------
# 🔍 Access the App
# -------------------------------------
# Open your browser and go to:
# → http://localhost:5173

# -------------------------------------
# 📁 Tech Stack
# -------------------------------------
# 🖼️ React (Vite)
# 🌐 Axios
# 🎨 TailwindCSS
# 🎮 Three.js for 3D visual forest
# 🧠 Lucide-react icons

# -------------------------------------
# ✅ You're all set to explore emotions in a new dimension!
