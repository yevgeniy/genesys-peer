import useCommonHook from "nimm-commonhook";
import { useEffect, useRef, useState } from "react";
import {dieUtilsGenerateRandoms, dieUtilsParseResults } from '../utils'
import usePeer from './usePeer'

const doRemoveDie=({dieId, set, setHasRolled})=> {
    setHasRolled(false);
    const i = window.__dieIds.findIndex(v=>v===dieId)
    window.__dieIds.splice(i,1);
    set.current.splice(i,1);
    window.__diceBox.set_dice(set.current);
    window.__diceBox.draw_selector();
}
const doAddDie=({name, dieId, set, setHasRolled})=> {
    setHasRolled(false);
    window.__dieIds = window.__dieIds || []
    window.__dieIds.push(dieId)
    set.current.push(name);
    window.__diceBox.set_dice(set.current);
    window.__diceBox.draw_selector();
}
const doClear=({setHasRolled, set})=> {
    setHasRolled(false);
    window.__dieIds = [];
    window.__diceBox.set_dice([]);
    window.__diceBox.clear();
    set.current=[];
}

const useParseMessage=({lastMessage, setHasRolled, setResults, set})=> {

    useEffect(()=> {
        if (!lastMessage)
            return;

        switch (lastMessage.type) {
            case 'add-die':
                doAddDie({name:lastMessage.name, dieId:lastMessage.dieId, set, setHasRolled})
                break;
            case 'remove-die':
                doRemoveDie({dieId: lastMessage.dieId, set, setHasRolled})
                break;
            case 'clear-dice':
                doClear({setHasRolled, set})
                break;
            case 'roll':
                setHasRolled(true);
                window.__diceBox.start_throw(
                    () => { /* notation getter */
                        return lastMessage.notation;
                    },
                    (vectors, notation, callback) => { /* before roll */
                        callback(lastMessage.results)
                    },
                    (notation, result) => { /* after roll */
                        const res = dieUtilsParseResults(notation.set, result)
                        setResults(r => [res, ...r])
                    },
                    lastMessage.vectors
                )
                break;
        }

        rerun(+new Date())
    
    },[lastMessage])

}


const useDice = () => {
    const [hasRolled, setHasRolled] = useState(false)
    const [results, setResults] = useState([])
    const set=useRef([])
    const [,rerun]=useState()

    const [{lastMessage}, {sendMessage}]=useCommonHook(usePeer) || [{},{}]
    useParseMessage({lastMessage, setHasRolled, setResults, set})

    window.__dieIdClicked = (dieId) => {
        doRemoveDie({dieId, set, setHasRolled})

        sendMessage({type:'remove-die', dieId})
    }

    const addDie = name => {
        const dieId=+new Date();
        doAddDie({name, dieId, set, setHasRolled})
        sendMessage({type:'add-die', name, dieId})
    }
    
    const roll=()=> {
        let vectors;
        let notation;
        setHasRolled(true);

        window.__diceBox.start_throw(
            () => { /* notation getter */
                var ret = { set:set.current, constant: 0, result: [], error: false }
                return ret
            },
            (v, n, callback) => { /* before roll */
                vectors = v;
                notation = n;
                const results=dieUtilsGenerateRandoms(set.current);
                sendMessage({ type: 'roll', vectors, notation, results })

                callback(results)
            },
            (notation, result) => { /* after roll */
                const res = dieUtilsParseResults(notation.set, result)
                setResults(r => [res, ...r])
            }
        )
    }
    const clearDice=()=> {
        doClear({setHasRolled, set})
        sendMessage({type:'clear-dice'})
    }
    return [results, { clearDice, addDie, roll, hasRolled }]
}

export default useDice;