'use client'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import {Search} from "lucide-react"
import axios from "axios"
import { useRouter } from 'next/navigation'
import { Story } from '@prisma/client'
import { getStoryById } from '@/actions/getStories'
import Select from "react-select"

type Props = {
    storyId:string
    CurrentUserId:string
    CurrentUserFirstName:string | null
    CurrentUserLastName:string | null
}

const NavbarStory = ({storyId, CurrentUserFirstName, CurrentUserLastName,CurrentUserId}: Props) => {
    const router = useRouter()
    const [showPopup, setShowPopup] = useState<boolean>(false)

    const PublishStory = async (topics:string[]) => {
        try {
            const response = await axios.patch('/api/publish-new-story',{
                storyId,
                topics
            })
            router.push(`/published/${response.data.id}`)
        } catch (error) {
            console.log('Error publishing the story', error)
        }
    }
  return (
    <div className='px-8 py-2 border-b-[1px]'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
            <Link href='/'>
                <Image src='/medium-icon.svg' width={40} height={40} alt='Medium Logo'/>
            </Link>
            </div>
            <div className='flex items-center space-x-7'>
            <button onClick={() => setShowPopup(!showPopup)} className='flex items-center opacity-90 hover:opacity-100 duration-100 ease-in cursor-pointer bg-green-600 hover:bg-green-700 rounded-full px-3 py-1 text-[13px] text-white'>Publish</button>
            <UserButton signInUrl='/'/>
            </div>
        </div>
        {showPopup && (
            <SaveStoryPopUp storyId={storyId} PublishStory={PublishStory} setShowPopUp={setShowPopup} CurrentUserFirstName={CurrentUserFirstName} CurrentUserLastName={CurrentUserLastName} CurrentUserId={CurrentUserId}/>
        )}
    </div>
  )
}

export default NavbarStory

type SaveStoryPopUptypes = {
    storyId:string
    PublishStory: (topics:string[]) => void
    setShowPopUp:React.Dispatch<React.SetStateAction<boolean>>
    CurrentUserId:string
    CurrentUserFirstName:string | null
    CurrentUserLastName:string | null
}

const SaveStoryPopUp = ({storyId,PublishStory,setShowPopUp,CurrentUserFirstName,CurrentUserId,CurrentUserLastName}:SaveStoryPopUptypes) => {
    const [Story, setStory] = useState<Story>()
    const [selectedtopics, setSelectedTopics] = useState<string[]>([])
    useEffect(() => {
        const fetchStoryById = async () => {
            try {
                const result = await getStoryById(storyId)
                if(result.response){
                    setStory(result.response)
                }
            } catch (error) {
                console.log('Error fetching the story data', error)
            }
        }

        fetchStoryById()
    })

    const topics = [
        {value:'Artificial Intelligence', label:"Artificial Intelligence"},
        {value:'Python', label:"Python"},
        {value:'Programming', label:"Programming"},
        {value:'Fashion', label:"Fashion"},
        {value:'World', label:"World"},
        {value:'Politics', label:"Politics"},
    ]

    if(!Story) return null

    // first 10 words for description

    const stripHtmlTags = (htmlString:string) => {
        return htmlString.replace(/<[^>]*>/g, '');
    };

    const contentWithoutH1 = Story.content!.replace(/<h1[^>]*>[\s\S]*?<\/h1>/g, '');

    const textWithoutHtml = stripHtmlTags(contentWithoutH1);

    const first10Words = textWithoutHtml.split(/\s+/).slice(0, 10).join(' ');

    // H1 tag for heading

    const h1match = Story.content!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

    const h1Element = h1match ? h1match[1] : '';
    

    const h1elemntwithouttag = stripHtmlTags(h1Element)
    
    // imgage Src for Image preview

    const ImageMatch = Story.content!.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/);

    const imgSrc = ImageMatch ? ImageMatch[1] : ''
    return(
        <div className='fixed bg-gray-50 w-full z-20 overflow-auto top-0 left-0 right-0 bottom-0'>
            <span onClick={(e) => {e.preventDefault() ;setShowPopUp(false)}} className='absolute top-4 right-6 text-3xl cursor-pointer'>
                &times;
            </span>
            <div className='max-w-[900px] mx-auto md:mt-28 mt-10 grid md:grid-cols-2 grid-cols-1 gap-14'>
                <div className='max-md:hidden'>
                    <p className='font-semibold'>Story Preview</p>
                    <div className='w-full h-[250px] bg-gray-100 rounded my-3 border-b-[1px]'>
                        {imgSrc && (
                            <Image src={imgSrc} width={250} height={250} alt='Preview Image' className='w-full h-full object-cover'/>
                        )}
                    </div>
                    <h1 className='border-b-[1px] text-[18px] font-semibold py-2'>{h1elemntwithouttag}</h1>
                    <p className='border-b-[1px] py-2 text-sm text-neutral-500 pt-3'>{first10Words}</p>
                    <p className='font-medium text-sm pt-2'>Note: <span className='font-normal text-neutral-500'>Changes here will affect how your story appears in public places like Medium’s homepage and in subscribers’ inboxes — not the contents of the story itself.</span></p>
                </div>
                <div>
                    <p className='py-2'>Publishing to: <span>{CurrentUserFirstName} {CurrentUserLastName}</span></p>
                    <p className='text-sm pb-3 pt-1 '>Add or change topics (up to 5) so readers know what your story is about</p>
                    <Select
                    placeholder='tags'
                    isMulti
                    onChange={(selectedvalues) => {
                        const values = selectedvalues as {value:string; label:string}[]

                        const stringValues = values.map((value) => value.value)

                        setSelectedTopics(stringValues)
                    }}  
                    isOptionDisabled={() => selectedtopics?.length >= 5}
                    name='topics'
                    options={topics}
                    className='basic-multi-select'
                    classNamePrefix='Add a topic ...'
                    />
                    <button onClick={() => PublishStory(selectedtopics)} className='px-4 py-2 bg-green-600 hover:bg-green-700 rounded-full text-white text-sm mt-8'>
                        Publish now
                    </button>
                </div>
            </div>
        </div>
    )
}