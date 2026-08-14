import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from "./component/Login.jsx"
import Register from './component/Register.jsx'
import ProtectedRoute from "./component/ProtectedRoute.jsx"
import Admin from "./component/Admin.jsx"
import AddDriver from './component/AddDriver.jsx'
import Driver from './component/Driver.jsx'
import Parent from "./component/Parent.jsx"
import AddBus from './component/AddBus.jsx'
import AddRoute from './component/AddRoute.jsx'
import AddStudent from './component/AddStudent.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";



function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path="/parents" element={
            <ProtectedRoute>
              <Parent />
            </ProtectedRoute>
          } />

          <Route path="/driver" element={
            <ProtectedRoute>
              <Driver />
            </ProtectedRoute>
          } />





          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />

          <Route path="/create-driver" element={
            <ProtectedRoute>
              <AddDriver />
            </ProtectedRoute>
          } />

        <Route path="/Add-Bus" element={
          <ProtectedRoute>
            <AddBus />
          </ProtectedRoute>
        } />

        
        <Route path="/Add-Route" element={
          <ProtectedRoute>
            <AddRoute />
          </ProtectedRoute>
        } />

        <Route path="/Add-Student" element={
          <ProtectedRoute>
            <AddStudent />
          </ProtectedRoute>
        } />
        
      </Routes>

    </BrowserRouter >
    </>
  )
}

export default App
