import { useEffect, useRef, useState } from "react";
import useCommonHook from "nimm-commonhook";
import { useDice, usePeer } from "./hooks";

const Slave=({children, hostPeerId})=> {
    const [, rerun]=useState();
    const [{peer, peerIds}, {connectToPeer, spreadConnections}]=useCommonHook(usePeer) || [{},{}]

    const [results, {roll, clearDice, hasRolled}]=useCommonHook(useDice) || [,{}]

    useEffect(()=> {
        if (!peer)
            return;
        if (!connectToPeer)
            return;
        if (!spreadConnections)
            return;
        peer.on('open', function (id) {
            const otherPeer = connectToPeer(hostPeerId.trim())

            otherPeer.on('data', data=> {
                const message=JSON.parse(data);

                if (message.type==='system-connections') {
                    spreadConnections(message.peers);
                }
            })
        });

        rerun(+new Date());
    },[peer,connectToPeer, spreadConnections])

    return children && children({ hasRolled, results, roll, clearDice, peerIds});
}

export default Slave;