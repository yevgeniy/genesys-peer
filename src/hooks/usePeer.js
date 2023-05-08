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

    const [isConnectedToHost, setIsConnectedToHost] = useState();
    const [toHostConnectionUrl, setToHostConnectionUrl] = useState();
    const [hostPeerId, setHostPeerId] = useState();
    const [isError, setIsError] = useState();

    const parseMessage = (data) => {
        setLastMessage(JSON.parse(data))
    }
    const sendMessage = (data) => {

        toHostConnection.current && toHostConnection.current.send(JSON.stringify(data));
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
            peer.current.on('connection', function (fromClientConnection) {
                fromClientConnection.on('data', (data) => {
                    parseMessage(data);
                })

            });

        }
    }, [])

    return [lastMessage, { isConnectedToHost, toHostConnectionUrl, hostPeerId, sendMessage }]
}

export default usePeer;