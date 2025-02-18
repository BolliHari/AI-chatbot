import { createContext, useState } from "react";
import run from "../config/gemini_ai";

export const Context = createContext();

const ContextProvider = (props) =>{

    const [input,setInput] = useState("")
    const [recentPrompt,setRecentPrompt] = useState("");
    const [prevPrompt,setPrevPrompt] = useState([]);
    const [showResult,setShowResult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultData,setResultData] = useState("");

    const delaypara = (index,nextword) =>{
        setTimeout(function (){
            setResultData(prev=>prev+nextword, nextword);
        },75*index)
    }


    const onSent = async (prompt) =>{
        setResultData("")
        setLoading(true)
        setRecentPrompt(input)
        setPrevPrompt((prev)=>[...prev,input])
        setShowResult(true);
        const response = await run(input)
        let responseArray = response.split("**");
        let newResponse ="" ;
        for (let i = 0; i < responseArray.length; i++)
        {
            if(i===0 || i%2 !==1){
                newResponse +=responseArray[i]
            }
            else{
                newResponse += "<b>"+responseArray[i]+"</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>");
        let newResponseArray = newResponse2.split(" ");
        for (let i=0; i<newResponseArray.length;i++){
            const nextword = newResponseArray[i]
            delaypara(i,nextword+" ")
        }
        setInput("")
        setLoading(false)
    }

    

    const contextValue = {

        prevPrompt,
        setPrevPrompt,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,

    }

    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>

    )


}

export default ContextProvider;