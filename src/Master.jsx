import { useEffect, useState } from "react";
import useCommonHook from "nimm-commonhook";
import { useDice, usePeer } from "./hooks";


const generateUrlToHost = id => {
    return `${location.href}?hostid=${id}`
}

const Master=({children})=> {
    const [toHostConnectionUrl, setToHostConnectionUrl] = useState();
    const [{peer, isError, peerIds}, {broadcast}]=useCommonHook(usePeer) || [{},{}]
    const [results, {roll, clearDice, hasRolled}]=useCommonHook(useDice) || [,{}]
    
    useEffect(()=> {        
        if (!peer) 
            return;
        if (!broadcast)
            return;
        
        peer.on('open', function (id) {
            const url = generateUrlToHost(id)
            setToHostConnectionUrl(url);
        });
        peer.on('connection', function (otherPeer) {
            broadcast(otherPeer.peer);
        });

    },[peer,broadcast])

    return children && children({toHostConnectionUrl, isError, hasRolled, results, roll, clearDice, peerIds});
}

export default Master;