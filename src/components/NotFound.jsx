import React from 'react'
import NavScroll from './Navbar'

function NotFound() {
  return (
    <>
        <NavScroll />
        <div className='mt-5 d-flex justify-content-center'>
            <h1 className='mt-5'>Không tìm thấy trang</h1>
        </div>
    </>
  )
}

export default NotFound