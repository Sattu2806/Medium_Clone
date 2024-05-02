'use client'
import { getAllComments } from '@/actions/Comments'
import { Clap, Comment } from '@prisma/client'
import axios from 'axios'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import UserBadge from './UserBadge'
import { ClapCount, ClapCountByUser } from '@/actions/Clap'
import ClapComponent from './ClapComponent'

type Props = {
    AuthorImage:string
    AuthorFirstName:string | null
    AuthorLastName:string | null
    NumberCommnets:number 
}

const CommentComponent = ({AuthorFirstName, AuthorImage,AuthorLastName, NumberCommnets}: Props) => {
    const [showSideComp, setShowSideComp] = useState<boolean>(false)
    const [Content, setContent] = useState<string>()
    const pathname = usePathname()
    const storyId = pathname.split( '/')?.[2] as string
    const [comments, setComments] = useState<Comments[]>([]);
    const [refetchcomment, setRefetch] = useState<boolean>(false)

    const CommentStory = async () => {
        try {
            await axios.post('/api/commentstory',{
                storyId,
                Content
            })
            setContent('')
            console.log('Success')
        } catch (error) {
            console.log("Error while commenting on story", error)
        }
    }


    useEffect(() => {
        const fetchComments = async () => {
            try {
                const result = await getAllComments(storyId)
                if(result && result.response){
                    setComments(result.response)
                }else{
                    console.log(result.error)
                }
            } catch (error) {
                console.log("Error fetching comments", error)
            }
        }

        fetchComments()
    },[refetchcomment])
  return (
    <div>
        <button onClick={() => setShowSideComp(!showSideComp)} className='flex items-center opacity-60'>
            <svg width="24" height="24" viewBox="0 0 24 24" className="ku"><path d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path></svg>
            <p className='text-sm'>{NumberCommnets}</p>
        </button>
        <div className={`h-screen fixed top-0 right-0 w-[400px] shadow-xl bg-white z-20 duration-200 ease-linear transform overflow-y-scroll ${showSideComp ? "translate-x-0" :"translate-x-[450px]"}`}>
            <div className='px-6 pt-6 flex items-center justify-between'>
                <p className='font-medium'>Responses ({NumberCommnets})</p>
                <span onClick={() => setShowSideComp(false)} className='cursor-pointer opacity-60 scale-150'>
                    &times;
                </span>
            </div>
            <div className='m-4 shadow-md'>
                <div className='flex items-center space-x-3 px-3 pt-3'>
                    <Image src={AuthorImage} width={32} height={32} alt='User'/>
                    <div className='text-sm'>
                        <p>{AuthorFirstName} {AuthorLastName}</p>
                    </div>
                </div>
                <textarea
                    value={Content}
                    onChange={e=>setContent(e.target.value)}
                    placeholder='what is your thoughts?'
                    className='w-full h-[100px] p-3 focus:outline-none placeholder:text-sm text-sm mt-3'
                />
                <div className='flex flex-row-reverse p-3'>
                    <div className='flex items-center space-x-4'>
                        <button onClick={() => setContent('')} className='text-sm'>Cancel</button>
                        <button onClick={CommentStory} className='text-sm px-4 py-[6px] bg-green-500 rounded-full text-white'>Respond</button>
                    </div>
                </div>
            </div>
            <RenderComments setRefetch = {setRefetch} storyId={storyId}/>
        </div>
    </div>
    
  )
}

export default CommentComponent

interface Comments extends Comment {
    replies:Comment[]
    Clap:Clap[]
}

const RenderComments = ({storyId, parentCommentId ,setRefetch}:{storyId:string, parentCommentId?:string, setRefetch?: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [comments, setComments] = useState<Comments[]>([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const result = await getAllComments(storyId, parentCommentId)
                if(result && result.response){
                    setComments(result.response)
                }else{
                    console.log(result.error)
                }
            } catch (error) {
                console.log("Error fetching comments", error)
            }
        }

        fetchComments()
    },[])

    return (
        <div className='mt-10 border-t-[1px]'>
            {comments.map((comment,index) => {
                const clapCounts = comment.Clap.map((clap) => clap.clapCount)
                const totalClaps = clapCounts.reduce((acc,curr)=> acc + curr ,0)
                return(
                    <div key={index} className='m-4 mt-5 py-4 border-b-[1px] border-neutral-100'>
                        <UserBadge userId={comment.userId} createdAt={comment.createdAt}/>
                        <p className='py-3 text-neutral-600 text-sm ml-3'>{comment.content}</p>
                        <UserEngagement storyId={comment.storyId} totalClaps={totalClaps} comment={comment} />
                    </div>
                )
            })}
        </div>
    )
}

const UserEngagement = ({storyId,comment,totalClaps}:{storyId:string, comment:Comments,totalClaps:number}) => {
    const [showCommentArea, setShowCommentArea] = useState<boolean>(false)
    const [shwoReplyComments, setShowReplyComments] = useState<boolean>(false)
    const [userClaps, setUserClaps] = useState<number>()

    useEffect(() => {
        const fetchClapCountByUser = async () => {
            try {
                const claps = await ClapCountByUser(storyId,comment.id)
                setUserClaps(claps)
            } catch (error) {
                console.log("Error fetching the user claps")
            }
        }

        fetchClapCountByUser()
    },[storyId])

    return(
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                    <ClapComponent storyId={storyId} ClapCount={totalClaps} commentId={comment.id} UserClaps={userClaps || 0}/>
                    {comment.replies.length > 0 && (
                        <button onClick={() => setShowReplyComments(!shwoReplyComments)} className='flex items-center space-x-2 text-sm opacity-80'>
                            <svg width="24" height="24" viewBox="0 0 24 24" className="ku"><path d="M18 16.8a7.14 7.14 0 0 0 2.24-5.32c0-4.12-3.53-7.48-8.05-7.48C7.67 4 4 7.36 4 11.48c0 4.13 3.67 7.48 8.2 7.48a8.9 8.9 0 0 0 2.38-.32c.23.2.48.39.75.56 1.06.69 2.2 1.04 3.4 1.04.22 0 .4-.11.48-.29a.5.5 0 0 0-.04-.52 6.4 6.4 0 0 1-1.16-2.65v.02zm-3.12 1.06l-.06-.22-.32.1a8 8 0 0 1-2.3.33c-4.03 0-7.3-2.96-7.3-6.59S8.17 4.9 12.2 4.9c4 0 7.1 2.96 7.1 6.6 0 1.8-.6 3.47-2.02 4.72l-.2.16v.26l.02.3a6.74 6.74 0 0 0 .88 2.4 5.27 5.27 0 0 1-2.17-.86c-.28-.17-.72-.38-.94-.59l.01-.02z"></path>
                            </svg>
                            {comment.replies.length} Replies
                        </button>
                    )}
                    <div>
                        <button onClick={() => setShowCommentArea(!showCommentArea)} className='text-sm opacity-80'>
                            Reply
                        </button>
                    </div>
                </div>
            </div>
            {shwoReplyComments && (
                <ReplyComments storyId={comment.storyId} parentCommentId={comment.id}/>
            )}
            {showCommentArea && (
                <div className='border-l-[3px] ml-5'>
                <CommentArea setShowCommentArea={setShowCommentArea} commentId={comment.id}/>
                </div>
            )}
        </div>
    )
}

const ReplyComments = ({storyId, parentCommentId}:{
    storyId:string, parentCommentId:string
}) => {
    const [userClaps, setUserclaps] = useState<number>()
    const [totalClaps, setTotalClaps] = useState<number>()

    useEffect(() => {
        const fetchClapCountByUser = async () => {
            try {
                const claps = await ClapCountByUser(storyId,parentCommentId)
                setUserclaps(claps)
            } catch (error) {
                console.log("Error fetching the user claps")
            }
        }
        
        const fetchTotalClaps = async () => {
            try {
                const claps = await ClapCount(storyId,parentCommentId)
                setTotalClaps(claps)
            } catch (error) {
                console.log("Error fetching the  claps")
            }
        }

        fetchTotalClaps()
        fetchClapCountByUser()
    },[storyId])

    return(
        <div>
            <RenderComments storyId={storyId} parentCommentId={parentCommentId}/>
        </div>
    )
}

const CommentArea = ({commentId, setShowCommentArea}:{commentId:string,setShowCommentArea:React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [Content, setContent] = useState<string>()
    const pathname = usePathname()
    const storyId = pathname.split( '/')?.[2] as string

    const replyComment = async () => {
        try {
            await axios.post('/api/replycomments',{
                storyId,
                Content,
                parentCommentId:commentId
            })
            setContent('')
            console.log('Success')
        } catch (error) {
            console.log("Error while replying to comment", error)
        }
    }
    return(
        <div className='m-4 shadow-md'>
            <textarea
                value={Content}
                onChange={e=>setContent(e.target.value)}
                placeholder='what is your thoughts?'
                className='w-full h-[100px] p-3 focus:outline-none placeholder:text-sm text-sm mt-3'
            />
            <div className='flex flex-row-reverse p-3'>
                    <div className='flex items-center space-x-4'>
                        <button onClick={() => { setShowCommentArea(false);setContent('')}} className='text-sm'>Cancel</button>
                        <button onClick={replyComment} className='text-sm px-4 py-[6px] bg-green-500 rounded-full text-white'>Respond</button>
                    </div>
            </div>
        </div>
    )
}