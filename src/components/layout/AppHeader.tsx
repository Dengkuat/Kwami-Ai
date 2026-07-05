import { MenuIcon } from '../icons/ServiceIcons'

function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-100 bg-white">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-50"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>

        <h1 className="text-lg font-bold text-kwami-green">Kigali Kwima</h1>

        <button
          type="button"
          className="text-sm font-medium text-kwami-green hover:text-kwami-green-dark"
        >
          Kinyarwanda
        </button>
      </div>
    </header>
  )
}

export default AppHeader
