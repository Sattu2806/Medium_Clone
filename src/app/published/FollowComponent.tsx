'use client'
import { CheckFollowing } from '@/actions/Following'
import { getCurrentUserId } from '@/actions/User'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

type Props = {
    AuthorId:string
}

const FollowComponent = ({AuthorId}: Props) => {
    const [isfollowed, setisfollowed] = useState<boolean>(false)
    const [currentUserId, setCurrentUserId] = useState<string>()

    useEffect(() =>{
        const fetchFollowingStatus = async () => {
            try {
                const response = await CheckFollowing(AuthorId)
                if(response?.ifFollowing)
                setisfollowed(response?.ifFollowing)
            } catch (error) {
                console.log("Error while fetching the following status",error)
            }
        }
        const fetchCurrentUserId = async () => {
            try {
                const UserId = await getCurrentUserId()
                if(UserId)
                setCurrentUserId(UserId)
            } catch (error) {
                console.log('No user found')
            }
        }

        fetchFollowingStatus()
        fetchCurrentUserId()
    },[AuthorId])

    const FollowAuthor = async () => {
        setisfollowed(!isfollowed)
        try {
            await axios.post('/api/following', {
                AuthorId
            })
            console.log('Success folloing')
        } catch (error) {
            console.log("Error in foloowing the author")
            setisfollowed(!isfollowed)
        }
    }

    console.log(currentUserId)
  return (
    <span onClick={FollowAuthor} className={`font-medium  cursor-pointer ${isfollowed ? "text-green-700":"text-red-400"} ${currentUserId === AuthorId ? "hidden":""}`}>. {`${isfollowed ? "followed":"follow"}`}</span>
  )
}

export default FollowComponent