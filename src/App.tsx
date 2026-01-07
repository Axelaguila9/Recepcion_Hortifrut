import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sku from './page/Sku'
import Cierre from './page/Cierre'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Cierre />} />
        <Route path='/sku' element={<Sku />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App