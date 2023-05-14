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
    const [isHost, setIsHost]=useState(null)
    const [toHostConnectionUrl, setToHostConnectionUrl] = useState();
    const [hostPeerId, setHostPeerId] = useState();
    const [isError, setIsError] = useState();
    const [slaveConnections, setSlaveConnections]=useState([])


    const parseMessage = (data, from) => {
        setLastMessage(JSON.parse(data))

        if (isHost)
            sendMessage(JSON.parse(data), from)
    }
    const sendMessage = (data, from) => {
        console.log("SENDING", data, from)
        if (toHostConnection.current)
            toHostConnection.current && toHostConnection.current.send(JSON.stringify(data));
        else if (isHost) {
            slaveConnections.forEach(conn=> {
                if (conn!==from)
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

            setIsHost(false);

            // peer.current.on('call', (call)=> {

            //     console.log('GOT CALL')
            //     call.answer()

            //     call.on('stream', (stream)=> {
            //         console.log("STREAMING", stream)
            //         const vid=document.querySelector('video')
            //         vid.srcObject=stream;

            //         setTimeout(()=> {
            //             console.log('PLAYING')
            //             vid.play();

            //             setIsConnectedToHost(true);
            //             setHostPeerId(hostPeerId);
            //         },2000)
            //     })

            // })

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

                setSlaveConnections(conns=>[...conns, fromSlaveConnection])

                // const slaveId= fromClientConnection.peer;
                // streamRef.current=streamRef.current || document.querySelector('canvas').captureStream(60);
                // const constraints = {
                //     width: { min: 600, ideal: 1920 },
                //     height: { min: 600, ideal: 1280 },
                //     advanced: [{ width: 1920, height: 1280 }, { aspectRatio: 1.333 }],
                // };
                // streamRef.current.getVideoTracks()[0].applyConstraints(constraints);

                // /* call the slave w/ canvas stream */
                // console.log("CALLING", slaveId)
                // const call= peer.current.call(slaveId, streamRef.current);
                
            });

            setIsHost(true);
        }
    }, [])

    return [{isHost, lastMessage, isConnectedToHost, toHostConnectionUrl, hostPeerId}, {  sendMessage }]
}

export default usePeer;