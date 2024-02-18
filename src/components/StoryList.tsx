'use client'
import { GetSelectedTopics } from '@/actions/Topics'
import { getStoryByTag } from '@/actions/getStories'
import { Story } from '@prisma/client'
import axios from 'axios'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Select from "react-select"
import StoryItem from './StoryItem'

type Props = {
    allTopics:{
        value:string
        label:string
    }[]
    UserTags:{
        value:string
        label:string
    }[]
}

const StoryList = ({allTopics,UserTags}: Props) => {
    const [filteredStories, setFilteredStories] = useState<Story[]>([])
    const [showPopup, setShowPopUp] = useState<boolean>(false)
    const searchparams = useSearchParams()
    const tag = searchparams.get('tag')

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await getStoryByTag(tag || 'All')
                setFilteredStories(response.stories)
            } catch (error) {
                console.log("Error in fetching teh data")
            }
        }

        fetchStory()
    },[searchparams])

  return (
    <div>
        <div className='flex items-center space-x-6 border-b-[1px] text-sm opacity-60'>
            <span onClick={() => setShowPopUp(!showPopup)} className='pb-3'>
                <Plus size={20}/>
            </span>
            <Link href='/' className={`pb-3 ${tag === null ? "border-b-[1px] border-neutral-950":""}`}>For you</Link>
            {UserTags.map((Tag,index) => (
                <Link key={index} href={`/?tag=${Tag.value}`} className={`pb-3 ${Tag.value === `${tag}` ? "border-b-[1px] border-neutral-950":""}`}>{Tag.label}</Link>
            ))}
        </div>
        {filteredStories.map((story) => (
            <StoryItem key={story.id} story={story} />
        ))}
        {showPopup && (
            <AddTagComp allTopics={allTopics} setShowPopUp={setShowPopUp} UserTags={UserTags}/>
        )}
    </div>
  )
}

export default StoryList


type TagsTyps = {
    allTopics:{
        value:string
        label:string
    }[]
    UserTags:{
        value:string
        label:string
    }[]
    setShowPopUp:React.Dispatch<React.SetStateAction<boolean>>
}

const AddTagComp = ({allTopics,setShowPopUp,UserTags}:TagsTyps) => {
    const [selectedtopics, setSelectedTopics] = useState<string[]>([])
    const [userSelectedtags, setUserSelectedTags] = useState<{
        value:string
        label:string
    }[]>(UserTags)

    const Addtags = async () => {
        try {
            await axios.post('/api/topics',{
                tag : selectedtopics
            })
            window.location.reload()
            console.log("Added tags successfully")
        } catch (error) {
            console.log("Error adding tags")
        }
    }

    
    return(
        <div className='fixed bg-gray-50 w-full z-20 overflow-auto top-0 left-0 right-0 bottom-0'>
            <span onClick={(e) => {e.preventDefault() ;setShowPopUp(false)}} className='absolute top-4 right-6 text-3xl cursor-pointer'>
                &times;
            </span>
            <div className='max-w-[900px] mx-auto md:mt-28 mt-10 w-full'>
                <div>
                    <Select
                    placeholder='tags'
                    isMulti
                    defaultValue={userSelectedtags}
                    onChange={(selectedvalues) => {
                        const values = selectedvalues as {value:string; label:string}[]

                        const stringValues = values.map((value) => value.value)

                        setSelectedTopics(stringValues)
                    }}  
                    isOptionDisabled={() => selectedtopics?.length >= 5}
                    name='topics'
                    options={allTopics}
                    className='basic-multi-select'
                    classNamePrefix='Add a topic ...'
                    />
                    <button onClick={() => Addtags()} className='px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white text-sm mt-8'>
                        Add Tags
                    </button>
                </div>
            </div>
        </div>
    )
}