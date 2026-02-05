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
          
          <nav className="hidden md:flex items-center space-x-8">
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
            
            <a 
              href="/PDF/GUIA_HORTIAPP.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Guía de Uso
            </a>
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