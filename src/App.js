import React, { useRef, useState, useEffect } from 'react'
import { BiCopyAlt, BiPlug, BiCommentError } from 'react-icons/bi'

import "./styles.css";
import "./genesys.css";
import { useDice, usePeer } from './hooks';
import DiceButton from './DiceButton';
import useCommonHook from 'nimm-commonhook';
import RollResult from './RollResult';

export default function App() {

  const [{ isHost, isConnectedToHost, toHostConnectionUrl, hostPeerId, isError }] = useCommonHook(usePeer) || [{}]
  const [results, { clearDice, roll, hasRolled }] = useCommonHook(useDice) || [[], {}]

  useEffect(() => {
    setTimeout(() => {

      dice_initialize(document.body)
    }, 1000)
  }, [])


  const copyToClipBoard = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(toHostConnectionUrl);
  }

  return (
    <div className="App">

      {/* {
        <div className={`vid-rig ${isConnectedToHost ? 'vid-rig-visible' : ''}`}>
          <video autoPlay width={1200} height={600} muted/>
        </div>
      } */}

      <div className="connection-rig">
        {toHostConnectionUrl && <>
          <h5>Connection url:</h5>
          <div>{toHostConnectionUrl} <BiCopyAlt className="copy-button" title="copy" onClick={copyToClipBoard} /></div>
          <sub>Using this url other players can connect to your host.</sub>
        </>}

        {isConnectedToHost && <>

          <h5>
            <BiPlug title={`connected`} size={30} color="#416649" />
            <i>{hostPeerId}</i>
          </h5>
        </>}

        {isError && <>
          <h5>
            <BiCommentError title={`some error connecting`} size={30} color="#cf364f" />
            <i>there was some error generating id or connecting.</i>
          </h5>
        </>}
      </div>

      
      

      <div className={`dice-rig ${hasRolled ? 'has-rolled' : ''}`}>
        <div>
          <div className="dice-buttons">
            <DiceButton name='ability' />
            <DiceButton name='proficiency' />
            <DiceButton name='difficulty' />
            <DiceButton name='challenge' />
            <DiceButton name='boost' />
            <DiceButton name='setback' />
            <DiceButton name='force' />
            <DiceButton name='d100' />
            <DiceButton name='d10' />
          </div>
          <div className='dice-button-controls'>
            <button onClick={roll} >Roll</button>
            <button onClick={clearDice}>Clear</button>
          </div>
        </div>
      </div>

      <div className='results-rig'>
        {results.slice(0, 30).map(result => <RollResult {...result} />)}
      </div>

      

      <div className="BAGGAGE">
        <div id="info_div" style={{ display: 'none' }}>
          <div className="center_field" >
            <span id="label"></span>
          </div>
          <div className="center_field">
            <div className="bottom_field">
              <span id="labelhelp">click to continue or tap and drag again</span>
            </div>
          </div>
        </div>
        <div id="selector_div" style={{ display: 'none' }}>
          <div className="center_field">
            <input type="text" id="set" value="4d6"></input>
            <button id="clear">clear</button>
            <button style={{ marginLeft: '0.6em' }} id="throw">throw</button>
          </div>
        </div>



        <div id="canvas" ></div>


      </div>

      {/* 

      <div style={{ position: 'relative', width: '450px' }}>




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


      </div> */}

    </div >
  );
}
