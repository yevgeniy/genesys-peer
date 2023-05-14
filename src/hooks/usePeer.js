import React, { useRef, useState, useEffect } from 'react'
import Peer from 'peerjs';

const getClientPeerId = () => {
    const m = location.href.match(/hostid=(.+?)$/)

    return m && m[1]
}
const generateUrlToHost = id => {
    return `${location.href}?hostid=${id}`
}

const usePeer = () => {

    const peer = useRef();
    const toHostConnection = useRef();
    const [lastMessage, setLastMessage] = useState()

    const [isConnectedToHost, setIsConnectedToHost] = useState(null);
    const isHost=useRef(null);
    const [, rerun]=useState();
    const [toHostConnectionUrl, setToHostConnectionUrl] = useState();
    const [hostPeerId, setHostPeerId] = useState();
    const [isError, setIsError] = useState();
    const slaveConnections=useRef([])


    const parseMessage = (data, from) => {
        setLastMessage(JSON.parse(data))

        if (isHost.current)
            sendMessage(JSON.parse(data), from)
    }
    const sendMessage = (data, from) => {
        console.log("SENDING", data, from)
        if (toHostConnection.current)
            toHostConnection.current && toHostConnection.current.send(JSON.stringify(data));
        else if (isHost.current) {
            slaveConnections.current.forEach(conn=> {
                if (conn.peer!==from?.peer)
                    conn.send(JSON.stringify(data));
            })
        }
    }


    useEffect(() => {
        peer.current = new Peer();
        const hostPeerId = getClientPeerId()

        if (hostPeerId) { /* is slave */
            peer.current.on('open', function (id) {
                toHostConnection.current = peer.current.connect(hostPeerId.trim());

                toHostConnection.current.on('open', function () {

                    toHostConnection.current.on('data', function (data) {
                        console.log("GOT MESSAGE FROM MASTER", data)
                        parseMessage(data)
                    });

                    setIsConnectedToHost(true);
                    setHostPeerId(hostPeerId);
                });
        
            });

            isHost.current=false;
            rerun(+new Date());

        } else { /* this is master */
            peer.current.on('open', function (id) {
                const url = generateUrlToHost(id)
                setToHostConnectionUrl(url);
            });
            peer.current.on('error', (err) => {
                console.log(err)
                setIsError(true)
            })
            peer.current.on('connection', function (fromSlaveConnection) {

                
                fromSlaveConnection.on('data', (data) => {
                    console.log("GOT MESSAGE FROM SLAVE", data)
                    parseMessage(data, fromSlaveConnection);
                });

                slaveConnections.current.push(fromSlaveConnection);
            });

            isHost.current=true;
            rerun(+new Date());
        }
    }, [])

    return [{isHost: isHost.current, lastMessage, isConnectedToHost, toHostConnectionUrl, hostPeerId}, {  sendMessage }]
}

export default usePeer;