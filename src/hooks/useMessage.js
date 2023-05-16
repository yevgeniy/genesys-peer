import { useCallback, useEffect, useRef, useState } from "react";

const useMessage=()=> {

    const [,rerun]=useState();
    const messages=useRef([])

    const [lastMessage, setLastMessage]=useState();
    const type=useRef(null)
    const slaves=useRef(null);
    const master=useRef(null);


    useEffect(()=> {

        const work=()=> {

            const message=messages.current.shift();
            if (message) {
                console.log(message)
                setLastMessage(JSON.parse( message));
            }
                
            requestAnimationFrame(work);
        }
        work();
    },[])

    useEffect(()=> { /* send lastMessage to slaves */
        if (type.current!=='master')
            return;
        if (lastMessage.type.match(/master/)) /* don't send messages meant for master */
            return;

        slaves.current.forEach(com=> {
            com.send(JSON.stringify(lastMessage));
        })

    },[lastMessage])

    const addMessage=(message)=> {
        if (type.current==='master') {
            messages.current.push(JSON.stringify( message));
        } else if (type.current==='slave') {
            master.current.send(JSON.stringify(message));
        }
    }

    const executeMessage=(message)=> {
        setLastMessage(JSON.parse(message))
    }

    const initMaster= useCallback( sl=> {
        type.current='master';
        slaves.current=sl;

        rerun(+new Date())
    },[])
    const initSlave= useCallback( m=> {
        type.current='slave';
        master.current=m;
        rerun(+new Date())
    },[])

    return [lastMessage, {addMessage, executeMessage, initMaster, initSlave}];
}

export default useMessage;