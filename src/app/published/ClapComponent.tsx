'use client'
import React, {useState, useEffect} from 'react'
import axios from 'axios'

type Props = {
    storyId:string
    ClapCount:number
    UserClaps:number
    commentId?:string
}

const ClapComponent = ({storyId, ClapCount, commentId, UserClaps}: Props) => {
    const [currentClapByUser, setCurrentClapByUser] = useState<number>(UserClaps)
    const [currentClaps, setCurrentClaps] = useState<number>(ClapCount)
    const [showPopup, setShowPopUp] = useState<boolean>(false)


    useEffect(() => {
        setCurrentClapByUser(UserClaps)
        setCurrentClaps(ClapCount)
    },[UserClaps, ClapCount])

    const ClapStoryorComment = async () => {
        if(currentClapByUser >= 50){
            setShowPopUp(true)
            return
        }

        setCurrentClaps((prevClaps) => prevClaps + 1);
  
        setCurrentClapByUser(currentClapByUser + 1);
        setShowPopUp(true);

        try {
            if(!commentId){
                await axios.post('/api/clap',{
                    storyId
                })
            }else{
                await axios.post('/api/clapcomment',{
                    storyId,
                    commentId
                })
            }
            console.log('success')
        } catch (error) {
            console.log('Error while clapping story or comment', Error)
            
            setCurrentClaps((prev) => prev -1)
            setCurrentClapByUser((prev) => prev -1 )
        }
    }

    useEffect(() =>{
        const timoeout = setTimeout(() => {
            setShowPopUp(false)
        }, 1000)
        return () => clearTimeout(timoeout)
    }, [showPopup])

    console.log(UserClaps)
  return (
    <button onClick={(e) => {e.preventDefault(); ClapStoryorComment()}} className='flex items-center relative'>
        <span className={`absolute bottom-10 w-[40px] h-[40px] bg-black rounded-full shadow-2xl shadow-neutral-300 text-white flex items-center justify-center duration-75 ease-in ${showPopup ? "scale-100 basis-10 opacity-100 translate-y-0":"scale-0 opacity-0 translate-y-8"}`}>
            {currentClapByUser}
        </span>
        {currentClapByUser > 0 ? (
            <svg width="24" height="24" viewBox="0 0 24 24" aria-label="clap"><path fillRule="evenodd" clipRule="evenodd" d="M11.37.83L12 3.28l.63-2.45h-1.26zM15.42 1.84l-1.18-.39-.34 2.5 1.52-2.1zM9.76 1.45l-1.19.4 1.53 2.1-.34-2.5zM20.25 11.84l-2.5-4.4a1.42 1.42 0 0 0-.93-.64.96.96 0 0 0-.75.18c-.25.19-.4.42-.45.7l.05.05 2.35 4.13c1.62 2.95 1.1 5.78-1.52 8.4l-.46.41c1-.13 1.93-.6 2.78-1.45 2.7-2.7 2.51-5.59 1.43-7.38zM12.07 9.01c-.13-.69.08-1.3.57-1.77l-2.06-2.07a1.12 1.12 0 0 0-1.56 0c-.15.15-.22.34-.27.53L12.07 9z"></path><path fillRule="evenodd" clipRule="evenodd" d="M14.74 8.3a1.13 1.13 0 0 0-.73-.5.67.67 0 0 0-.53.13c-.15.12-.59.46-.2 1.3l1.18 2.5a.45.45 0 0 1-.23.76.44.44 0 0 1-.48-.25L7.6 6.11a.82.82 0 1 0-1.15 1.15l3.64 3.64a.45.45 0 1 1-.63.63L5.83 7.9 4.8 6.86a.82.82 0 0 0-1.33.9c.04.1.1.18.18.26l1.02 1.03 3.65 3.64a.44.44 0 0 1-.15.73.44.44 0 0 1-.48-.1L4.05 9.68a.82.82 0 0 0-1.4.57.81.81 0 0 0 .24.58l1.53 1.54 2.3 2.28a.45.45 0 0 1-.64.63L3.8 13a.81.81 0 0 0-1.39.57c0 .22.09.43.24.58l4.4 4.4c2.8 2.8 5.5 4.12 8.68.94 2.27-2.28 2.71-4.6 1.34-7.1l-2.32-4.08z"></path></svg>
        ):(
        <svg className='opacity-60' width="24" height="24" viewBox="0 0 24 24" aria-label="clap"><path fill='#000' fillRule="evenodd" clipRule="evenodd" d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"></path></svg>
        )}
        <p className='text-sm opacity-60'>{currentClaps}</p>
    </button>
  )
}

export default ClapComponent