import React, { useEffect } from 'react'
import { BiCopyAlt, BiPlug, BiCommentError } from 'react-icons/bi'

import "./styles.css";
import "./genesys.css";
import DiceButton from './DiceButton';
import RollResult from './RollResult';
import Master from './Master'
import Slave from './Slave'

const getClientPeerId = () => {
  const m = location.href.match(/hostid=(.+?)$/)

  return m && m[1]
}

const copyToClipBoard = (e, toHostConnectionUrl) => {
  e.stopPropagation();
  e.preventDefault();
  navigator.clipboard.writeText(toHostConnectionUrl);
}

export default function App() {

  const hostPeerId = getClientPeerId()

  useEffect(() => {
    setTimeout(() => {

      dice_initialize(document.body)
    }, 1000)
  }, [])

  return <div className="App">
    {
      React.cloneElement(hostPeerId ? <Slave hostPeerId={hostPeerId} /> : <Master />, {}, 
        ({toHostConnectionUrl, isError, hasRolled, results, roll, clearDice, peerIds})=> <>
        
        <div className="connection-rig">
          {toHostConnectionUrl && <>
            <h5>Connection url:</h5>
            <div>{toHostConnectionUrl} <BiCopyAlt className="copy-button" title="copy" onClick={e=>copyToClipBoard(e,toHostConnectionUrl)} /></div>
            <sub>Using this url other players can connect to your host.</sub>
          </>}

          {peerIds && peerIds.map(v=> {
            return <>
            
              <h5>
                <BiPlug title={`connected`} size={30} color="#416649" />
                <i>{v}</i>
              </h5>
            </>
          })}

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
          {(results||[]).slice(0, 30).map(result => <RollResult {...result} />)}
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

      </>)
    }
  </div>

}
