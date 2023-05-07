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

    const [isConnectedToHost, setIsConnectedToHost] = useState();
    const [toHostConnectionUrl, setToHostConnectionUrl] = useState();
    const [hostPeerId, setHostPeerId] = useState();
    const [isError, setIsError] = useState();

    const parseMessage = (data) => {
        console.log('MESSAGE RECIEVED', data);
    }


    useEffect(() => {
        peer.current = new Peer();

        const hostPeerId = getClientPeerId()
        if (hostPeerId) { /* is client, connect to host */
            peer.current.on('open', function (id) {
                toHostConnection.current = peer.current.connect(hostPeerId.trim());

                toHostConnection.current.on('open', function () {

                    toHostConnection.current.on('data', function (data) {
                        parseMessage(data)
                    });

                    // Send messages
                    //toHostConnection.send('Hello!');

                    setIsConnectedToHost(true);
                    setHostPeerId(hostPeerId);
                });
            });

        } else { /* this is host, generate connection string for other clients to connect to */
            peer.current.on('open', function (id) {
                const url = generateUrlToHost(id)
                setToHostConnectionUrl(url);
            });
            peer.current.on('error', (err) => {
                console.log(err)
                setIsError(true)
            })
        }
    }, [])

    return [{ isConnectedToHost, toHostConnectionUrl, hostPeerId }]
}

export default usePeer;