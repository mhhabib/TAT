import './App.css';
import React from 'react';
import { useEffect, useState } from "react";
import axios from "axios";

const App=()=>{
    const [file, setFile]=useState(null)
    const [postfiles, setPostfiles]=useState([])
    const [words, setWords]=useState();
    const [characters, setcCharacters]=useState();
    const [sentences, setSentences]=useState();
    const [paragraphs, setParagraphs]=useState();
    const [longestparagraphs, setLongestparagraphs]=useState();
    const [showfileinfo, setShowfileinfo]=useState(false)
    const [isDatafetching, setIsDatafetching]=useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        controlData()
    }, []);

    const controlData = async () => {
        setIsDatafetching(true)
        const response = await fetch("http://localhost:8080/getfiles/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (response.status === 200) {
            if(data.textfiles){
                setPostfiles(data.textfiles);
            }
            else{
                setPostfiles(data);
            }
            // console.log(data.textfiles)
            setIsDatafetching(false)
            
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsDatafetching(true)
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await axios.post(
                "http://localhost:8080/createfiles/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            
            if (response?.status === 201) {
                setFile(null);
                controlData()
                setIsDatafetching(false)

                setMessage("created")
                setTimeout(() => {
                    setMessage("");
                }, 5000);
            }
        } catch (error) {
            console.log("Something went wrong!")
        }
    };
    const deleteFile = async(e, fId)=>{
        e.preventDefault()
        try {
            const response = await axios.delete(`http://localhost:8080/file/${fId}/`);
            if (response.status === 200) {
                console.log("File successfully deleted! Deleted id is ", fId)
                controlData();
                setMessage("deleted")
                setTimeout(() => {
                    setMessage("");
                }, 5000);
            }
          } catch (error) {
            console.log(error)
          }
    }
    const wordsHandler = async(e, fId)=>{
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/words/${fId}/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            console.log(data)
            if(response.status===200){
               if(data.words) setWords(data.words)
               else setWords(data)
               setcCharacters(null)
               setParagraphs(null)
               setSentences(null)
               setLongestparagraphs(null)
               setShowfileinfo(true)
            }
        } catch (err) {
            console.log(err);
        }
    }
    const charactersHandler = async(e, fId)=>{
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/characters/${fId}/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            if(response.status===200){
               if(data.characters) setcCharacters(data.characters)
               else setcCharacters(data)
               setWords(null)
               setParagraphs(null)
               setSentences(null)
               setLongestparagraphs(null)
               setShowfileinfo(true)
            }
        } catch (err) {
            console.log(err);
        }
    }
    const sentencesHandler = async(e, fId)=>{
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/sentences/${fId}/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            if(response.status===200){
                if(data.sentences) setSentences(data.sentences)
                else setSentences(data)
               setcCharacters(null)
               setParagraphs(null)
               setWords(null)
               setLongestparagraphs(null)
               setShowfileinfo(true)
            }
        } catch (err) {
            console.log(err);
        }
    }
    const paragrapshHandler = async(e, fId)=>{
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/paragraphs/${fId}/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            if(response.status===200){
                if(data.paragraphs) setParagraphs(data.paragraphs)
                else setParagraphs(data)
               setcCharacters(null)
               setWords(null)
               setSentences(null)
               setLongestparagraphs(null)
               setShowfileinfo(true)
            }
        } catch (err) {
            console.log(err);
        }
    }
    const longestparagraphsHandler = async(e, fId)=>{
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/longest-words/${fId}/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            if(response.status===200){
               if(data.longestparagraphs) setLongestparagraphs(data.longestparagraphs)
               else setLongestparagraphs(data)
               setcCharacters(null)
               setParagraphs(null)
               setSentences(null)
               setWords(null)
               setShowfileinfo(true)
            }
        } catch (err) {
            console.log(err);
        }
    }
    const showFileBox=()=>{
        setShowfileinfo(false)
    }
    const lastName=(textfile)=>{
        const lName = textfile.split("-")
        return lName[lName.length-1]
    }
    return <>
         
        <div className="bg-[#232425] w-full min-h-screen flex flex-col items-center justify-center p-8">
            <div className=" w-[60%] text-[#a9a9b3]">
                <form>
                    <div className="flex items-center space-x-4">
                        <input type="file" className="border w-full rounded-md px-4" onChange={(e) => setFile(e.target.files[0])}/>
                        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-progress" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                </form>
                {isDatafetching && <div className="mt-10 flex items-center space-x-4">
                    <h1 className="text-center font-semibold text-teal-600">Data fetching ....</h1>
                 </div>}

                 {message==="deleted" && 
                    <div className="mt-5 flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-400 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                            <span className="font-medium">Danger alert!</span> Text file successfully deleted!
                        </div>
                    </div>
                }
                { message === "created" &&
                    <div className="mt-5 flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                        <svg className="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
                        </svg>
                        <span className="sr-only">Info</span>
                        <div>
                            <span className="font-medium">Success alert!</span> Ssuccessfully created new file.
                        </div>
                    </div>
                }
                {showfileinfo && 
                    <div className="mt-10 relative flex items-center space-x-4 border border-gray-300 rounded-lg p-4">
                        <button className="absolute top-[-10px] right-[-10px] p-1 bg-red-500 text-white rounded-full" onClick={showFileBox}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 11.414l4.293-4.293a1 1 0 0 1 1.414 1.414L11.414 12l4.293 4.293a1 1 0 1 1-1.414 1.414L10 13.414l-4.293 4.293a1 1 0 1 1-1.414-1.414L8.586 12 4.293 7.707a1 1 0 1 1 1.414-1.414L10 10.586l4.293-4.293a1 1 0 1 1 1.414 1.414L11.414 12z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <ul>
                            {words?.length>0 && <li>Number of words      : {words}</li> }
                            {characters?.length>0 && <li>Number of characters : {characters}</li>}
                            {sentences?.length>0 && <li>Number of sentences  : {sentences}</li>}
                            {paragraphs?.length>0 && <li>Number of paragraph  : {paragraphs}</li>}
                            {longestparagraphs?.length>0 && <li>Longest paragraph    : {longestparagraphs}</li>}
                        </ul>
                    </div>
                }
                <ul className="mt-20 max-w-screen-md mb-4 px-3 text-base font-normal text-[#B4B4B8] space-y-1 text-gray-400 list-disc list-inside selection:bg-gray-600 selection:text-gray-100">
                    <h3 className="font-extrabold text-green-400 text-2xl">
                        Published Text files
                    </h3>
                    <hr/>
                    {postfiles?.map((post) => (
                        <li key={post._id} className="flex justify-between items-center">
                        <span>{lastName(post.textUrl)}</span>
                            <div> 
                                <span className="text-xs text-red-400 mr-4 hover:cursor-pointer underline decoration-gray-200" onClick={(event) => deleteFile(event, post._id)}>Delete</span>
                                <span className="text-xs px-1 text-gray-200 hover:cursor-pointer underline decoration-pink-500" onClick={(event) => wordsHandler(event, post._id)}>Words/</span>
                                <span className="text-xs px-1  text-teal-400 hover:cursor-pointer underline decoration-pink-500" onClick={(event) => charactersHandler(event, post._id)}>Characters/</span>
                                <span className="text-xs px-1  text-gray-200 hover:cursor-pointer underline decoration-pink-500" onClick={(event) => sentencesHandler(event, post._id)}>Sentences/</span>
                                <span className="text-xs px-1 text-teal-400 hover:cursor-pointer underline decoration-pink-500" onClick={(event) => paragrapshHandler(event, post._id)}>Paragraphs/</span>
                                <span className="text-xs px-1 text-gray-200 hover:cursor-pointer underline decoration-pink-500" onClick={(event) => longestparagraphsHandler(event, post._id)}>Longest Words</span>
                            </div>
                        </li>
                    ))}
                    {
                        postfiles.length===0 && 
                        <li >
                            Empty! Not published text file found!
                        </li>
                    }
                </ul>
            </div>
        </div>
    </>
}

export default App;
