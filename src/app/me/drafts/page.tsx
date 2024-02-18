import { getDraftStory, getPublishedStory, getSavedStory } from '@/actions/me'
import React from 'react'
import StoryPage from '../StoryPage'
import Navbar from '@/components/Navbar'

type Props = {}

const page = async (props: Props) => {
    const drafts = await getDraftStory()
    const published = await getPublishedStory()
    const saved = await getSavedStory()
  return (
    <div>
      <Navbar/>
        <StoryPage stories={drafts.response} TotalDrafts={drafts.response.length} TotalPublished={published.response.length} TotalSaved={saved.response.length}/>
    </div>
  )
}

export default page