import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div>
        <div className='bg-cover bg-bottom bg-[url(https://i.pinimg.com/736x/95/ef/61/95ef6196a96de39d92cf033867dc0505.jpg)] pt-8 h-screen w-full flex justify-between flex-col'>
            <img className='w-16 ml-8' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber" />
            <div className='bg-white pb-7 py-4 px-4'>
                <h2 className='text-3xl font-bold'>Get started with Uber</h2>
                <Link to="/login" className='flex justify-center items-center w-full bg-black text-white py-3 rounded mt-5'>Continue</Link>
            </div>
        </div>
    </div>
  )
}

export default Start