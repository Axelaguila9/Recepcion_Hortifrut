import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-700 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">H</span>
            </div>
            <h1 className="text-2xl font-bold">Horti</h1>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link to="/" className="hover:text-sky-400 transition-colors font-medium">
                  CIERRE
                </Link>
              </li>
              <li>
                <Link to="/sku" className="hover:text-sky-400 transition-colors font-medium">
                  SKU
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      
      <div className="bg-sky-400 border-t border-white/10">
        <div className="container mx-auto px-2 py-2">
        </div>
      </div>
    </header>
  )
}