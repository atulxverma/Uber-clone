import React from 'react'
import { Link } from 'react-router-dom'

const Riding = () => {
  return (
    <div className='h-screen flex flex-col'>

        <Link to="/home" className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full '>
            <i className="text-lg font-medium ri-home-5-line"></i>
        </Link>

      {/* TOP MAP IMAGE */}
      <div className='h-1/2'>
        <img
          className="h-full w-full object-cover"
          src="/map.png"
          alt=""
        />
      </div>

      {/* BOTTOM DETAILS PANEL */}
      <div className='h-1/2 bg-white rounded-t-3xl p-5 flex flex-col justify-between shadow-lg'>

        {/* DRIVER + CAR */}
        <div className='flex items-center justify-between'>

          {/* CAR IMAGE FIXED */}
          <div className="w-24 h-16 flex items-center overflow-visible">
            <img
              className="scale-[1.9] -ml-6"
              src="/Uber-car.png"
              alt="car"
            />
          </div>

          {/* DRIVER INFO revealed clearly */}
          <div className='text-right'>
            <h2 className='text-lg font-semibold'>Atul</h2>
            <h4 className='text-xl font-bold leading-tight'>
              MP 04 AB 1234
            </h4>
            <p className='text-sm text-gray-500'>
              Maruti Suzuki Alto
            </p>
          </div>

        </div>


        {/* RIDE INFO */}
        <div className="w-full mt-4 border-t pt-2">

          {/* LOCATION */}
          <div className="flex items-center gap-4 py-3 border-b">
            <i className="ri-map-pin-2-fill text-xl text-gray-700"></i>
            <div>
              <h3 className="text-base font-medium">
                562/11-A
              </h3>
              <p className="text-sm text-gray-500">
                Kankariya Talab, Ahmedabad
              </p>
            </div>
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-4 py-3">
            <i className="ri-currency-line text-xl text-gray-700"></i>
            <div>
              <h3 className="text-base font-semibold">
                ₹193.20
              </h3>
              <p className="text-sm text-gray-500">
                Cash Payment
              </p>
            </div>
          </div>

        </div>


        {/* PAYMENT BUTTON */}
        <button className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-3 rounded-xl shadow-md">
          Make a Payment
        </button>

      </div>

    </div>
  )
}

export default Riding
