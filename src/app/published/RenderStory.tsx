import { Story } from '@prisma/client'
import { MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import ClapComponent from './ClapComponent'
import CommentComponent from './CommentComponent'
import ShareComponent from './ShareComponent'
import SaveComponent from './SaveComponent'
import { ClapCount, ClapCountByUser } from '@/actions/Clap'
import { getCurrentuser } from '@/actions/User'
import { NumberOfComments } from '@/actions/Comments'
import { CheckSaved } from '@/actions/Save'
import FollowComponent from './FollowComponent'
import "highlight.js/styles/github.css"

type Props = {
    AuthorFirstName:string | null
    AuthorLastName:string | null
    AuthorImage: string
    PublishedStory:Story
}

const RenderStory = async ({AuthorFirstName,AuthorImage,AuthorLastName,PublishedStory}: Props) => {

    const stripHtmlTags = (htmlString:string) => {
        return htmlString.replace(/<[^>]*>/g, '');
    };

    const h1match = PublishedStory.content!.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

    const h1Element = h1match ? h1match[1] : '';
    
    const h1elemntwithouttag = stripHtmlTags(h1Element)
    
    const clapCounts = await ClapCount(PublishedStory.id) 
    const UserClaps = await ClapCountByUser(PublishedStory.id)

    const CurrentUser = await getCurrentuser()

    const NumberCommnets = await NumberOfComments(PublishedStory.id)
    

    const SavedStatus = await CheckSaved(PublishedStory.id)
    console.log(SavedStatus)
    

    const content = PublishedStory.content!;

    const firstH1Match = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/);

    const sanitizedContent = firstH1Match
    ? content.replace(firstH1Match[0], '')
    : content;

    const finalSanitizedContent = sanitizedContent.replace(/<h1[^>]*>[\s\S]*?<\/h1>|<select[^>]*>[\s\S]*?<\/select>|<textarea[^>]*>[\s\S]*?<\/textarea>/gi, '');
  return (
    <div className='flex items-center justify-center mt-6 max-w-[800px] mx-auto'>
        <div>
            <h1 className='text-4xl font-bold my-8'>{h1elemntwithouttag}</h1>
            <div className='flex items-center space-x-5'>
                <Image src={AuthorImage} className='rounded-full ' width={44} height={44} alt='User'/>
                <div className='text-sm'>
                    <p>{AuthorFirstName} {AuthorLastName} <FollowComponent AuthorId={PublishedStory.authorId}/></p>
                    <p className='opacity-60'>Published on {new Date(PublishedStory.updatedAt).toDateString().split(' ').slice(1,4).join(' ')}</p>
                </div>
            </div>
            <div className='border-y-[1px] border-neutral-200 py-3 mt-6 flex items-center justify-between px-3'>
                <div className='flex items-center space-x-4'>
                    <ClapComponent storyId={PublishedStory.id} ClapCount={clapCounts} UserClaps={UserClaps}/>
                    <CommentComponent NumberCommnets={NumberCommnets.reponse ? NumberCommnets.reponse : 0} AuthorFirstName={CurrentUser.firstName} AuthorImage={CurrentUser.imageUrl} AuthorLastName={CurrentUser.lastName}/>
                </div>
                <div className='flex items-center space-x-4'>
                    <SaveComponent storyId={PublishedStory.id} SavedStatus={SavedStatus.Status}/>
                    <ShareComponent/>
                    <button>
                        <MoreHorizontal size={24} className='opacity-80 text-green-800'/>
                    </button>
                </div>
            </div>
            <div className='prose my-5 font-mono' dangerouslySetInnerHTML={{__html:finalSanitizedContent}}></div>
        </div>
    </div>
  )
}

export default RenderStory