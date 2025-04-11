import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Layout from './components/Layout'
import Region from './pages/Region'
import Team from './pages/Team'
import Teams from './pages/Teams'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/region/:regionName" element={<Region />} />
        <Route path="/team" element={<Team />} />
        <Route path="/teams" element={<Teams />} />
      </Routes>
    </Layout>
  )
}

export default App
