import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './components/Dashboard'
import BlockDetail from './components/BlockDetail'
import TransactionDetail from './components/TransactionDetail'
import AddressPage from './components/AddressPage'

function App() {
  return (
    <BrowserRouter>
      <div className="app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ paddingTop: '70px', flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/block/:number" element={<BlockDetail />} />
            <Route path="/tx/:hash" element={<TransactionDetail />} />
            <Route path="/address/:address" element={<AddressPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
