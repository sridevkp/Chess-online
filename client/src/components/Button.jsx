import React from 'react'

const Button = ({ children, onClick }) => {
  return (
    <button 
        onClick={onClick}
        className='bg-green-600 rounded-md p-3 w-56 text-xl font-bold text-white shadow-[2px_2px_0_1px_rgba(45,130,0,1)] active:shadow-[-2px_-2px_0_1px_rgba(45,130,0,1)] hover:brightness-110'>
        {
           children
        }
    </button>
  )
}

export default Button