import Peer from 'peerjs';
import React, { useRef, useState, useEffect } from 'react'

/* https://react-icons.github.io/react-icons/icons?name=bi */
import { BiCopyAlt } from 'react-icons/bi'

import "./styles.css";
import "./genesys.css";

export default function App() {

  const peer = useRef();
  const [peerId, setPeerId] = useState();

  useEffect(() => {
    //console.log(dice_initialize(document.body))
  }, [])


  useEffect(() => {
    peer.current = new Peer();
    peer.current.on('open', function (id) {
      setPeerId(id);
    });
    peer.current.on('error', (err) => {
      console.log(err)
    })
    peer.current.on('connection', function (connFromClient) {
      console.log("GOT CONNECTION FROM CLIENT", connFromClient);

      connFromClient.on('data', (data) => {
        console.log("READING FROM CLIENT", data)
      })
    });
  }, [])


  const doConnect = () => {
    const id = document.querySelector('#peer-id-input').value;

    const connToHost = peer.current.connect(id);
    connToHost.on('open', function () {

      // Receive messages
      connToHost.on('data', function (data) {
        console.log('DATA FROM HOST', data);
      });

      // Send messages
      connToHost.send('Hello!');
    });
  }

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(peerId);
  }

  return (
    <div className="App">
      {peerId && <h4>Your peed id: {peerId} <BiCopyAlt className="copy-button" title="copy" onClick={copyToClipBoard} /></h4>}

      <input type='text' id="peer-id-input" />
      <button onClick={doConnect}>
        Connect
      </button>

      <div>
        EXAMPLES:
        <ul>
          <li><code>.boost</code>: <span className="genesys dice boost">j</span></li>
          <li><code>.ability</code>: <span className="genesys dice ability">k</span></li>
          <li><code>.proficiency</code>: <span className="genesys dice proficiency">l</span></li>
          <li><code>.setback</code>: <span className="genesys dice setback">j</span></li>
          <li><code>.difficulty</code>: <span className="genesys dice difficulty">k</span></li>
          <li><code>.challenge</code>: <span className="genesys dice challenge">l</span></li>
        </ul>
        <div>
          <p>The dice shapes</p>
          <ul>
            <li>j: <span className="genesys">j</span></li>
            <li>k: <span className="genesys">k</span></li>
            <li>l: <span className="genesys">l</span></li>
          </ul>
        </div>
        <div>
          <p>The dice results</p>
          <ul>
            <li>a: <span className="genesys">a</span></li>
            <li>s: <span className="genesys">s</span></li>
            <li>t: <span className="genesys">t</span></li>
            <li>h: <span className="genesys">h</span></li>
            <li>f: <span className="genesys">f</span></li>
            <li>d: <span className="genesys">d</span></li>
          </ul>
        </div>
        <div>
          <p>Power Level icons</p>
          <ul>
            <li>c: <span className="genesys">c</span></li>
            <li>p: <span className="genesys">p</span></li>
            <li>g: <span className="genesys">g</span></li>
          </ul>
        </div>
      </div>

      <div id="canvas"></div>

    </div>
  );
}
