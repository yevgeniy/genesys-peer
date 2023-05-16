import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import Peer from 'peerjs';

const generateUrlToHost = id => {
    return `${location.href}?hostid=${id}`
}

const usePeer = () => {
    const peer=useRef(new Peer())

    const [toHostConnectionUrl, setToHostConnectionUrl] = useState();
    const [isError, setIsError] = useState();
    const [lastMessage, setLastMessage]=useState(null);
    const peerConnections=useRef([])

    useEffect(()=> {
        peer.current.on('open', function (id) {
            const url = generateUrlToHost(id)
            setToHostConnectionUrl(url);
        });
        peer.current.on('error', (err) => {
            console.log(err)
            setIsError(true)
        })

        peer.current.on('connection', function (otherPeer) {

            otherPeer.on('data', (data) => {
                console.log("GOT MESSAGE FROM SLAVE", data)
                setLastMessage(JSON.parse(data))
            });

            peerConnections.current.push(otherPeer);
        })
        
    })

    const broadcast = useCallback(()=> {
        peerConnections.current.forEach(con=> {
            con.send(JSON.stringify( {type:'system-connections', connections: peerConnections.current.map(v=>v.peerId)}))
        })
    },[]);
    const sendMessage = useCallback( (message)=> {
        peerConnections.current.forEach(con=> {
            con.send(JSON.stringify( message))
        })
    },[])
    
    return [{peer: peer.current, toHostConnectionUrl, isError, lastMessage}, {broadcast, sendMessage}]
}

export default usePeer;