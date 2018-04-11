import Home from './components/pages/Home'
import Files from './components/pages/Files'
import Uploads from './components/pages/Uploads'
import Chat from './components/pages/Chat'
import Login from './components/forms/Login'
import Register from './components/forms/Register'

export default [
  {
    path: '/files', component: Files
  },
  {
    path: '/uploads', component: Uploads
  },
  {
    path: '/chat', component: Chat
  },
  {
    path: '/login', component: Login
  },
  {
    path: '/signup', component: Register
  },
  {
    path: '*', component: Home
  }
]
