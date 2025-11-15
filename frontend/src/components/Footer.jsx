import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-900 text-gray-300 text-center py-6 mt-auto">
        <p>© {new Date().getFullYear()} PantryPal. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-3">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Use</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>
      </footer>
      </div>
  )
}

export default Footer