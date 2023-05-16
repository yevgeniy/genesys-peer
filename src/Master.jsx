import React, { useEffect, useRef, useState } from "react";
import Peer from 'peerjs';
import useCommonHook from "nimm-commonhook";
import { useDice, useMessage, usePeer } from "./hooks";




const Master=({children})=> {
    const [{peer, toHostConnectionUrl, isError}, {broadcast}]=useCommonHook(usePeer) || [{},{}]
    const [, rerun]=useState();

    const [results, {roll, clearDice, hasRolled}]=useCommonHook(useDice) || [,{}]

    useEffect(()=> {        
        if (!peer) 
            return;
        if (!broadcast)
            return;
        
        peer.on('connection', function (otherPeer) {
            broadcast();
        });

        rerun(+new Date());
    },[peer,broadcast])

    return children && children({toHostConnectionUrl, isError, hasRolled, results, roll, clearDice});
}

export default Master;