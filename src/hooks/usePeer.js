import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import Peer from 'peerjs';

const generateUrlToHost = id => {
    return `${location.href}?hostid=${id}`
}

const wireConnection=(otherPeer, peerConnections, setLastMessage, rerun)=> {
    peerConnections.current.push(otherPeer);
    let stat='alive';

    otherPeer.on('data', (data) => {
        const message=JSON.parse(data);
        setLastMessage(message)

        if (message.type==='still-alive?') {
            otherPeer.send(JSON.stringify( {type:'still-alive'}))
        } else if (message.type==='still-alive') {
            stat='alive';
        }
            
    });
    let t;
    otherPeer.on('close', ()=> {
        clearInterval(t);
        const i=peerConnections.current.findIndex(v=>v===otherPeer)
        peerConnections.current.splice(i,1);
        rerun(+new Date())
    })
    t = setInterval(()=> {
        if (stat==='alive') {
            stat='asking'
            otherPeer.send(JSON.stringify( {type:'still-alive?'}))
        } else if (stat==='asking') {
            stat='terminated'
            otherPeer.close();
        }
        
    }, 5000);

    rerun(+new Date())
}

const usePeer = () => {
    const [,rerun]=useState();
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
            if (peerConnections.current.some(v=>v.peer===otherPeer.peer))
                return;
            
            wireConnection(otherPeer, peerConnections, setLastMessage, rerun);
            
            
        })
        
    })

    const broadcast = useCallback((ignore)=> {
        peerConnections.current.forEach(con=> {
            if (con.peer!==ignore)
                con.send(JSON.stringify( {type:'system-connections', peers: peerConnections.current.map(v=>v.peer)}))
        })
    },[]);
    const sendMessage = useCallback( (message)=> {
        peerConnections.current.forEach(con=> {
            con.send(JSON.stringify( message))
        })
    },[])

    const connectToPeer=useCallback(id=> {
        const otherPeer = peer.current.connect(id);
        wireConnection(otherPeer, peerConnections, setLastMessage, rerun);

        return otherPeer;
    },[])

    const spreadConnections=useCallback((peerIds)=> {
        peerIds.forEach(id=> {
            if (peerConnections.current.some(con=>con.peer===id))
                return;
            if (id===peer.current._id)
                return;
            
            connectToPeer(id);
        })
    })
    
    
    return [{
            peer: peer.current, 
            toHostConnectionUrl, 
            isError, 
            lastMessage, 
            peerIds: peerConnections.current.map(v=>v.peer)
        }, 
        {broadcast, sendMessage, connectToPeer, spreadConnections}
    ]
}

export default usePeer;