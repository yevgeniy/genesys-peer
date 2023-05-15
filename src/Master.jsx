import React, { useEffect, useRef, useState } from "react";
import Peer from 'peerjs';
import useCommonHook from "nimm-commonhook";
import { useDice, useServerBus } from "./hooks";


const generateUrlToHost = id => {
    return `${location.href}?hostid=${id}`
}

const Master=({children})=> {
    const peer=useRef()
    const [, rerun]=useState();

    
    const [toHostConnectionUrl, setToHostConnectionUrl] = useState();
    const slaveConnections=useRef([])
    const [, {addMessage, initMaster}] = useCommonHook(useServerBus) || [, {}]
    const [isError, setIsError] = useState();

    const [results, {roll,clearDice, hasRolled}]=useCommonHook(useDice) || [,{}]

    useEffect(()=> {
        if (!initMaster)
            return;
        peer.current = new Peer();
        
        peer.current.on('open', function (id) {
            const url = generateUrlToHost(id)
            setToHostConnectionUrl(url);
            initMaster(slaveConnections.current);
        });
        peer.current.on('error', (err) => {
            console.log(err)
            setIsError(true)
        })
        peer.current.on('connection', function (fromSlaveConnection) {

            fromSlaveConnection.on('data', (data) => {
                console.log("GOT MESSAGE FROM SLAVE", data)
                addMessage(JSON.parse(data))
            });

            slaveConnections.current.push(fromSlaveConnection);
        });

        rerun(+new Date());
    },[initMaster])

    return children && children({toHostConnectionUrl, isError, hasRolled, results, roll, clearDice});
}

export default Master;