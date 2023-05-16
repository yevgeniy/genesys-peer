import React, { useEffect, useRef, useState } from "react";
import Peer from 'peerjs';
import useCommonHook from "nimm-commonhook";
import { useDice, useMessage } from "./hooks";


const Slave=({children, hostPeerId})=> {
    const peer=useRef()
    const [, rerun]=useState();
    const [isConnectedToHost, setIsConnectedToHost] = useState(null);
    const [, {executeMessage, initSlave}] = useCommonHook(useMessage) || [, {}]

    const [results, {roll, clearDice, hasRolled}]=useCommonHook(useDice) || [,{}]

    useEffect(()=> {
        if (!initSlave)
            return;
        peer.current = new Peer();
        peer.current.on('open', function (id) {
            const toMasterConnection = peer.current.connect(hostPeerId.trim());

            toMasterConnection.on('open', function () {
                initSlave(toMasterConnection)

                toMasterConnection.on('data', function (data) {
                    console.log("GOT MESSAGE FROM MASTER", data)
                    executeMessage(data)
                });

                setIsConnectedToHost(true);
            });
    
        });

        rerun(+new Date());
    },[initSlave])

    return children && children({isConnectedToHost, hasRolled, results, roll, clearDice});
}

export default Slave;