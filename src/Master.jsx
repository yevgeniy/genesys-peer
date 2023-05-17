import { useEffect, useState } from "react";
import useCommonHook from "nimm-commonhook";
import { useDice, useMessage, usePeer } from "./hooks";




const Master=({children})=> {
    const [{peer, toHostConnectionUrl, isError, peerIds}, {broadcast}]=useCommonHook(usePeer) || [{},{}]
    const [, rerun]=useState();

    const [results, {roll, clearDice, hasRolled}]=useCommonHook(useDice) || [,{}]

    useEffect(()=> {        
        if (!peer) 
            return;
        if (!broadcast)
            return;
        
        peer.on('connection', function (otherPeer) {
            broadcast(otherPeer.peer);
        });

        rerun(+new Date());
    },[peer,broadcast])

    return children && children({toHostConnectionUrl, isError, hasRolled, results, roll, clearDice, peerIds});
}

export default Master;