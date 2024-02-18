import Navbar from '@/components/Navbar'
import React from 'react'
import NewStory from '../New-Story'
import NavbarStory from '../NavbarStory'
import { getStoryById } from '@/actions/getStories'
import { getCurrentuser } from '@/actions/User'

type Props = {}

const page = async ({ params }: { params: { storyId: string } }) => {
    const Story = await getStoryById(params.storyId)
    const User = await getCurrentuser()
  return (
    <div className='max-w-[1000px] mx-auto ' role='textbox' data-length>
        <NavbarStory storyId={params.storyId} CurrentUserId={User.id} CurrentUserFirstName={User?.firstName || ''} CurrentUserLastName={User?.lastName || ''} />
        <NewStory storyId={params.storyId} Storycontent={Story.response?.content}/>
    </div>
  )
}

export default page