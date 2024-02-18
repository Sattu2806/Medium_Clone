'use client'
import { ClipboardPaste, Code, Dot, Image, MoreHorizontal, Plus } from 'lucide-react'
import {createRoot} from "react-dom/client"
import React, { useEffect, useRef, useState } from 'react'
import MediumEditor from "medium-editor"
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';
import './new_story.css'
import { ImageUpload } from '@/actions/cloudinary'
import hljs from "highlight.js"
import "highlight.js/styles/github.css"
import axios from 'axios'
import { getStoryById } from '@/actions/getStories'
import { Story } from '@prisma/client'


type Props = {
    storyId:string
    Storycontent:string | null |undefined
}

const NewStory = ({storyId, Storycontent}: Props) => {
    const contentEditabeRef = useRef<HTMLDivElement | null>(null)
    const [openTools, setOpenTools] = useState<boolean>(false)
    const [buttonPosition, setbuttonPosition] = useState<{top:number, left:number}>({top:0, left:0})
    const [saving, setSaving] = useState<boolean>(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    
    function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
        let timeoutId: ReturnType<typeof setTimeout>;
      
        return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            func.apply(this, args);
          }, delay);
        };
      }
      
    const debouncedHandleSave = useRef(
    debounce(() => {
        handleSave();
    }, 1000)
    ).current;

      const handleSave = async () => {
        const content = contentEditabeRef.current?.innerHTML
        setSaving(true)

        try {
            await axios.patch('/api/new-story', {
                storyId,
                content
            })
            console.log('saved')
        } catch (error) {
            console.log('Error in saving')
        }
        setSaving(false)
      }

    const InserImageComp = () => {
        fileInputRef.current?.click()
    }
    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0]
        if(file){
            setOpenTools(false)

            const localImageUrl = URL.createObjectURL(file)
            
            const ImageComponent = <ImageComp imageUrl={localImageUrl} file={file} handleSave={debouncedHandleSave}/>

            const wrapperDiv = document.createElement('div')
            const root = createRoot(wrapperDiv)
            root.render(ImageComponent)

            contentEditabeRef.current?.appendChild(wrapperDiv)
        }

    }

    const InserDivider = () => {
        const DividerComp = <Divider/>
        setOpenTools(false)
        const wrapperDiv = document.createElement('div')
        const root = createRoot(wrapperDiv)
        root.render(DividerComp)
        contentEditabeRef.current?.appendChild(wrapperDiv)
        handleSave()
    }

    const InserCodeBlock = () => {
        const CodeBlockComp = <CodeBlock handleSave={debouncedHandleSave}/>
        setOpenTools(false)
        const wrapperDiv = document.createElement('div')
        const root = createRoot(wrapperDiv)
        root.render(CodeBlockComp)
        contentEditabeRef.current?.appendChild(wrapperDiv)
    }

    const getCaretPosition = () => {
        let x = 0;
        let y = 0;
        
        const isSupported  = typeof window.getSelection !== 'undefined'

        if(isSupported){
            const selection = window.getSelection() as Selection
            if(selection?.rangeCount > 0){
                const range = selection.getRangeAt(0).cloneRange()
                const rect = range.getClientRects()[0]
                if(rect){
                    x  = rect.left + window.screenX
                    y = rect.top + window.scrollY -80
                }
            }
        }

        return {x, y}
    }

    useEffect(() => {

        const handleInput = () => {
            const {x , y} = getCaretPosition()
            setbuttonPosition({top:y, left: -50})

            debouncedHandleSave()
        }

        contentEditabeRef.current?.addEventListener('input', handleInput)
    },[])

    useEffect(() => {
        if(typeof window.document !== 'undefined'){
            const editor = new MediumEditor('.editable',{
                elementsContainer:document.getElementById('container') as HTMLElement,
                toolbar:{
                    buttons:['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'h3', 'quote']
                }
            })
            return () => {
                editor.destroy()
            }
        }

    },[])


    const [Story, setStory] = useState<Story>()
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        const fetchStoryById = async () => {
            setLoading(true)
            try {
                const story = await getStoryById(storyId)
                if(story.response)
                setStory(story.response)
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }

        fetchStoryById()
    },[])

    console.log(Story)



  return (
    <main id='container' className='max-w-[800px] mx-auto relative font-mono mt-8'>
        <p className='absolute -top-[72px] opacity-30'>{saving ? "saving...":"saved"}</p>
        <div
            id='editable'
            ref={contentEditabeRef}
            contentEditable
            suppressContentEditableWarning
            className='outline-none focus:outline-none editable max-w-[800px] prose'
            style={{whiteSpace:'pre-line'}}
        >
            { Storycontent ? (
                    <div dangerouslySetInnerHTML={{__html:Storycontent}}></div>
            ):(
                <div>
                    <h1 className='font-medium' data-h1-placeholder='New Story Title'></h1>
                    <p data-p-placeholder='Write your story ...'></p>
                </div>
            )}
        </div>
        <div className={`z-10 ${buttonPosition.top === 0 ? "hidden" :""}`} style={{position:'absolute', top:buttonPosition.top, left:buttonPosition.left}}>
            <button onClick={() => setOpenTools(!openTools)} id='tooltip' className='border-[1px] border-neutral-500 p-1 rounded-full inline-block'>
                <Plus className={`duration-300 ease-linear ${openTools ? "rotate-90":""}`}/>
            </button>
            <div id='tool' className={`flex items-center space-x-4 absolute top-0 left-14  ${openTools ? "visible":"invisible"}`} >
                <span onClick={InserImageComp} className={`border-[1.5px] border-green-500 rounded-full block p-[6px] ${openTools ? "scale-100 visible" :"scale-0 invisible"} ease-linear duration-100 bg-white cursor-pointer`}>
                <Image size={20} className='opacity-60 text-green-800 '/>
                <input 
                type="file"
                accept='image/*'
                style={{display:'none'}}
                ref = {fileInputRef}
                onChange={handleFileInputChange}
                />
                </span>
                <span onClick={InserDivider} className={`border-[1.5px] border-green-500 rounded-full block p-[6px] ${openTools ? "scale-100 visible" :"scale-0 invisible"} ease-linear duration-100 delay-75 bg-white cursor-pointer`}>
                    <MoreHorizontal size={20} className='opacity-60 text-green-800 ' />
                </span>
                <span onClick={InserCodeBlock} className={`border-[1.5px] border-green-500 rounded-full block p-[6px] ${openTools ? "scale-100 visible" :"scale-0 invisible"} ease-linear duration-100 delay-100 bg-white cursor-pointer`}>
                    <Code size={20} className='opacity-60 text-green-800 ' />
                </span>
            </div>
        </div>
    </main>
  )
}

export default NewStory


const ImageComp = ({imageUrl, file, handleSave}:{imageUrl:string, file:File, handleSave: () => void}) => {
    const [currentImageUrl, setCurrentImageUrl] = useState<string>(imageUrl)

    const updateImageUrl = async () => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            await ImageUpload(formData).then((SecureImageUrl) => 
                setCurrentImageUrl(SecureImageUrl)
            )
        } catch (error) {
            console.log('Error uplaoding the image', error)
        }
    }

    useEffect(() => {
        updateImageUrl().then(() => {
            handleSave()
        })
    }, [imageUrl])
    return(
        <div className='py-3'>
            <div>
                <img src={currentImageUrl} alt="Image" className='max-w-full h-[450px]' />
                <div className='text-center text-sm max-w-md mx-auto'>
                    <p
                     data-p-placeholder = 'Type caption for your image'
                    >
                            
                    </p>
                </div>
            </div>
            <p data-p-placeholder='...'></p>
        </div>
    )
}


const Divider = () => {
    return(
        <div className='py-3 w-full'>
            <div className='text-center flex items-center justify-center ' contentEditable={false}>
                    <MoreHorizontal size={32}/> 
            </div>
            <p data-p-placeholder='Write your text ...'></p>
        </div>
    )
}


const CodeBlock = ({handleSave}:{handleSave:() => void}) => {
    const [language, setlanguage] = useState<string>('javascript')
    const [code, setCode] = useState<string>('')
    const [highlightedCode, sethighlightedCode] = useState<string>('')

    console.log(code)
    
    const handlelanguageChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
        setlanguage(event.target.value)
    }

    const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.preventDefault()
        setCode(event.currentTarget.value || '')
    }

    const handlePaste = async () => {
        try {
            const clipboardData = await navigator.clipboard.readText()
            console.log(clipboardData)

            setCode((prev) => prev + clipboardData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const highlighted = hljs.highlight(code, {
            language,
            ignoreIllegals:true
        }).value
        sethighlightedCode(highlighted)
        handleSave()
    }, [language, code, highlightedCode])


    return (
        <div className='w-full'>
            <div  className='w-full relative bg-stone-100 rounded-sm p-5 focus:outline-none'>
                <div>
                    <select 
                    contentEditable={false}
                    className='bg-gray-100 border-dotted border-[2px] rounded-sm p-1 text-stone-700'
                    defaultValue={language}
                    onChange={handlelanguageChange}
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                    </select>
                </div>
                <textarea 
                    className='focus:outline-none p-2 w-full mt-4'
                    onChange={(e) => { e.preventDefault(); handleCodeChange(e) }}
                    onPaste={handlePaste}
                />
                <button onClick={handlePaste} className='absolute top-2 right-2 cursor-pointer'>
                    <ClipboardPaste/>
                </button>
                <div
                    className={`language-${language} text-base block overflow-auto p-3 focus:outline-none`}
                    dangerouslySetInnerHTML={{__html:highlightedCode}}
                    style={{whiteSpace:"pre-wrap"}}
                >
                    
                </div>
            </div>
            <p data-p-placeholder='Write your text ...'></p>
        </div>
    )
}