import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Chat from './pages/Chat'
import Profile from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/Profile' element={<Profile />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/' element={<Chat />}></Route>
      </Routes>
    </BrowserRouter>
  )
}
