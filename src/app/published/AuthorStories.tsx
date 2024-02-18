import { Story } from '@prisma/client';
import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import ClapComponent from './ClapComponent';
import SaveComponent from './SaveComponent';
import { useState } from 'react';
import { useEffect } from 'react';
import { ClapCount, ClapCountByUser } from '@/actions/Clap';
import { CheckSaved } from '@/actions/Save';

type Props = {
    story:Story
    AuthorFirstName:string | null
    AuthorLastName:string | null
    AuthorImage: string
}

const AuthorStories = ({story,AuthorFirstName,AuthorImage,AuthorLastName}: Props) => {
    const [userClaps, setUserclaps] = useState<number>(0)
    const [totalClaps, setTotalClaps] = useState<number>(0)
    const [SavedStatus, setSavedStatus] = useState<boolean>(false)


    useEffect(() => {
        const fetchClapCountByUser = async () => {
            try {
                const claps = await ClapCountByUser(story.id)
                setUserclaps(claps)
            } catch (error) {
                console.log("Error fetching the user claps")
            }
        }
        
        const fetchTotalClaps = async () => {
            try {
                const claps = await ClapCount(story.id)
                setTotalClaps(claps)
            } catch (error) {
                console.log("Error fetching the  claps")
            }
        }

        const fetchSavedStatus = async () => {
            try {
                const Savedstatus = await CheckSaved(story.id)
                if(Savedstatus.Status)
                setSavedStatus(Savedstatus.Status)
            } catch (error) {
                console.log("Error fetching the saved status")
            }
        }

        fetchSavedStatus()
        fetchTotalClaps()
        fetchClapCountByUser()
    },[story.id])


    
    const stripHtmlTags = (htmlString:string) => {
        return htmlString.replace(/<[^>]*>/g, '');
    };
    const match = story.content!.match(/<img[^>]*src=["']([^"']*)["'][^>]*>/);
    const imgSrc = match ? match[1] : '';
    const h1match = story.content!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

    const h1Element = h1match ? h1match[1] : '';

    const finalh1Element = stripHtmlTags(h1Element)
    // Use stripHtmlTags to remove HTML tags
    const textWithoutHtml = stripHtmlTags(story.content!);

    // Split the text into words and select the first 20
    const first10Words = textWithoutHtml.split(/\s+/).slice(0, 10).join(' ');
  return (
    <Link key={story.id} href={`/published/${story.id}`}>
            <Image src={imgSrc ? imgSrc : "/no-image.jpg"} width={250} height={200} alt='Image' />
            <div className='flex items-center space-x-2 mt-5'>
                <Image src={AuthorImage} width={20} height={20} alt='User' />
                <p className='text-xs font-medium'>{AuthorFirstName} {AuthorLastName}</p>
            </div>
            <p className='font-bold mt-4'>{finalh1Element}</p>
            <p className='mt-2 text-sm text-neutral-500'>{first10Words} ...</p>
            <div className='flex items-center justify-between mt-3'>
                <div className='flex items-center space-x-4'>
                    <ClapComponent storyId={story.id} UserClaps={userClaps} ClapCount={totalClaps}/>
                    <SaveComponent storyId={story.id} SavedStatus={SavedStatus} />
                </div>
            </div>
        </Link>
  )
}

export default AuthorStories