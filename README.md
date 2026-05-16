# WeShare — Social Media Client

> React-based social media frontend, part of the WeShare platform. Built with React Context for state management and connected to a shared Node.js backend.

🌐 **Live Demo:** [wesharemedia.onrender.com](https://wesharemedia.onrender.com)  
🔧 **Backend Repo:** [Weshare-server](https://github.com/arbi222/Weshare-server)  

💬 **Messenger App:** [Weshare-messenger](https://github.com/arbi222/Weshare-messenger)

---

## What Is WeShare?

WeShare is a full social media platform where users can share posts, interact with others, and receive real-time notifications. It is one of two independent frontend applications that share the same backend — the other being the WeShare Messenger.

---

## Features

- User registration, login, and profile management
- Create, edit, and delete posts with image and video uploads
- Like, comment, and interact with other users' posts
- Add friend system
- User blocking — blocked users cannot interact with your content
- Real-time notifications via Socket.io
- Online presence tracking
- Responsive design for all screen sizes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React.js |
| State Management | React Context API |
| Routing | React Router |
| Real-Time | Socket.io Client |
| HTTP Client | Axios |
| File Storage | Firebase Storage |
| Styling | Pure CSS |

---

## Architecture Note

This app is intentionally decoupled from the social media frontend. Both apps connect to the same backend via REST and Socket.io, but run as independent deployments. This architecture allows each app to scale and evolve independently.

```
  Weshare-client      Weshare-messenger
    (This app)  ──┐  ┌──  (Messenger)
                  ▼  ▼
              Weshare-server
          (Shared REST + Socket.io)
```

---

## Author

**Arbi Hamolli** — Full-Stack Web Developer  
[arbihamolli.com](https://arbihamolli.com) · [LinkedIn](https://linkedin.com/in/arbi-hamolli) · [GitHub](https://github.com/arbi222)
