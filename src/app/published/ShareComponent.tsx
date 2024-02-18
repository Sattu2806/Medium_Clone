'use client'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

type Props = {}

const ShareComponent = (props: Props) => {
    const [showPopup, setShowPopUp] = useState<boolean>(false)
    const pathname = usePathname()
  return (
    <div className='relative'>
        <button className='mt-1' onClick={() =>setShowPopUp(!showPopup)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.22 4.93a.42.42 0 0 1-.12.13h.01a.45.45 0 0 1-.29.08.52.52 0 0 1-.3-.13L12.5 3v7.07a.5.5 0 0 1-.5.5.5.5 0 0 1-.5-.5V3.02l-2 2a.45.45 0 0 1-.57.04h-.02a.4.4 0 0 1-.16-.3.4.4 0 0 1 .1-.32l2.8-2.8a.5.5 0 0 1 .7 0l2.8 2.8a.42.42 0 0 1 .07.5zm-.1.14zm.88 2h1.5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2H8a.5.5 0 0 1 .35.14c.1.1.15.22.15.35a.5.5 0 0 1-.15.35.5.5 0 0 1-.35.15H6.4c-.5 0-.9.4-.9.9v10.2a.9.9 0 0 0 .9.9h11.2c.5 0 .9-.4.9-.9V8.96c0-.5-.4-.9-.9-.9H16a.5.5 0 0 1 0-1z" fill="currentColor"></path></svg>
        </button>
        {showPopup && (
        <div className='w-[250px] h-[100px] rounded-md shadow-lg absolute bottom-12 -left-20'>
            <input value={`${process.env.NEXT_PUBLIC_URL}${pathname}`} className='overflow-hidden p-2 m-2 border-[1px] rounded-md bg-gray-100'/>
            <button onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}${pathname}`)} className='text-center w-full py-2'>
                Copy Link
            </button>
        </div>
        )}
    </div>
  )
}

export default ShareComponent