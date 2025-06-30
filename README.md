# 🧯 Fire Extinguisher Monitoring System  
A full-stack web application that helps authorities **monitor fire extinguishers** in real time using barcode-based tracking.  
Built with **React.js** on the frontend and **Node.js (Express)** on the backend ⚙️  
> 🎯 Ensures all extinguishers are tracked, updated, and replaced before expiry to prevent emergency failures.  
## ✨ Features  
✅ Track extinguisher details: Coach No, Mfg Date, Expiry Date, Batch No  
✅ Real-time expiry tracking and alerts 🔔  
✅ Admin Dashboard for management  
✅ Barcode-based identification  
✅ Scalable for buildings, trains, or public infrastructure  
## 🛠️ Tech Stack  
### Frontend: [React.js](https://reactjs.org/)  
- 📦 Functional components + Hooks  
- 🎨 CSS for clean, responsive design  
- 📡 Axios to interact with backend  
### Backend: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)  
- 🧠 REST API for data management  
- 📦 Middleware for validation and security  
- 🗃️ (Optional) MongoDB for persistent storage  
## 📁 Folder Structure  
```
fire_extinguisher/  
├── client/             # React frontend  
│   ├── src/  
│   ├── public/  
│   └── package.json  
├── server/             # Node.js backend  
│   ├── routes/  
│   ├── controllers/  
│   ├── models/  
│   └── index.js  
└── README.md  
```  
## ⚙️ Setup Instructions  
### 🔹 1. Clone the Repository  
```bash  
git clone https://github.com/venkatapavan22/fire_extinguisher.git  
cd fire_extinguisher  
```  
### 🔹 2. Install Frontend (React)  
```bash  
cd client  
npm install  
npm start  
```  
### 🔹 3. Install Backend (Node.js)  
```bash  
cd server  
npm install  
npm run dev  
```  
Make sure your backend is running on `http://localhost:5000`  
and frontend on `http://localhost:3000`  
## 📦 API Routes Overview (Sample)  
| Method | Endpoint                 | Description                    |  
|--------|--------------------------|--------------------------------|  
| GET    | `/api/extinguishers`     | Fetch all extinguisher data    |  
| POST   | `/api/extinguishers`     | Add new extinguisher details   |  
| PUT    | `/api/extinguishers/:id` | Update extinguisher info       |  
| DELETE | `/api/extinguishers/:id` | Delete extinguisher record     |  
## 🚀 Future Enhancements  
- ✅ Add QR/Barcode scanner using mobile camera 📷  
- 📲 Push notifications or SMS alerts  
- 📊 Analytics Dashboard with charts  
- 👮 Role-based access (Admin/User)  
- ☁️ Deploy on Vercel + Render/Netlify  
## 🙋‍♂️ Author  
Made with ❤️ by [Venkata Pavan Vissamsetti](https://github.com/venkatapavan22)  
🚀 Passionate Full Stack Developer | Focused on Real-World Solutions  
## 📝 License  
This project is licensed under the **MIT License** 📄  
> ⭐ If you found this helpful, please **star the repo** and **follow me on GitHub**. Let’s connect!
