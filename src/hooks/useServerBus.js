import { useEffect, useRef, useState } from "react";

const useServerBus=()=> {

    const messages=useRef([])
    const [lastMessage, setLastMessage]=useState();

    const work=()=> {
        const message=messages.current.shift();
        if (message) {
            console.log(message)
            setLastMessage(JSON.parse( message));
        }
            

        requestAnimationFrame(work);
    }

    useEffect(()=> {
        requestAnimationFrame(work)
    },[])

    const addMessage=(message)=> {
        messages.current.push(JSON.stringify( message));
    }

    return [lastMessage, {addMessage}];
}

export default useServerBus;