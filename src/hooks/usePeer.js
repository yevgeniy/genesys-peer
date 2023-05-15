import React, { useRef, useState, useEffect, useMemo } from 'react'
import Peer from 'peerjs';


const usePeer = (type /*master | slave */) => {
    const peer=useRef()

    useMemo(()=> {
        if (type==='master') {
            peer.current = new Peer();
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
                    addMessage(data)
                });
    
                slaveConnections.current.push(fromSlaveConnection);
            });
        } else if (type==='slave') {
            peer.current.on('open', function (id) {
                const toMasterConnection = peer.current.connect(hostPeerId.trim());
    
                toMasterConnection.on('open', function () {
    
                    toMasterConnection.on('data', function (data) {
                        console.log("GOT MESSAGE FROM MASTER", data)
                        executeMessage(data)
                    });
    
                    setIsConnectedToHost(true);
                });
        
            });
        }
        

        rerun(+new Date());
    },[])
    
    return [{type}]
}

export default usePeer;