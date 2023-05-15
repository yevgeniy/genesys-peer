import useCommonHook from "nimm-commonhook";
import { useEffect, useRef, useState } from "react";
import useServerBus from "./useServerBus";
import {dieUtilsGenerateRandoms, dieUtilsParseResults } from '../utils'


const useParseMessage=(lastMessage,addMessage)=> {
    const [hasRolled, setHasRolled] = useState(false)
    const [results, setResults] = useState([])
    const set=useRef([])
    const [,rerun]=useState()

    useEffect(()=> {
        if (!lastMessage)
            return;

        switch (lastMessage.type) {
            case 'add-die':
                setHasRolled(false);
                window.__dieIds = window.__dieIds || []
                window.__dieIds.push(lastMessage.dieId)
                set.current.push(lastMessage.name);
                window.__diceBox.set_dice(set.current);
                window.__diceBox.draw_selector();
                break;
            case 'remove-die':
                setHasRolled(false);
                const i = window.__dieIds.findIndex(v=>v===lastMessage.dieId)
                window.__dieIds.splice(i,1);
                set.current.splice(i,1);
                window.__diceBox.set_dice(set.current);
                window.__diceBox.draw_selector();
                break;
            case 'clear-dice':
                setHasRolled(false);
                window.__dieIds = [];
                window.__diceBox.set_dice([]);
                window.__diceBox.clear();
                set.current=[];
                break;
            case 'master-roll':
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
                        addMessage({ type: 'slave-roll', vectors, notation, results })

                        callback(results)
                    },
                    (notation, result) => { /* after roll */
                        console.log('RESULT:', notation, result)
                        const res = dieUtilsParseResults(notation.set, result)
                        setResults(r => [res, ...r])
                    }
                )
                break;
            case 'slave-roll':
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

    return {hasRolled, results}
}


const useDice = () => {

    const [lastMessage, {addMessage}] = useCommonHook(useServerBus) || [, {}]

    const {hasRolled, results} = useParseMessage(lastMessage, addMessage)

    window.__dieIdClicked = (dieId) => {
        addMessage({type:'remove-die', dieId})
    }

    const addDie = name => {
        addMessage({type:'add-die', name, dieId:+new Date()})
    }
    
    const roll=()=> {
        addMessage({type:'master-roll'})
    }
    const clearDice=()=> {
        addMessage({type:'clear-dice'})
    }

    return [results, { clearDice, addDie, roll, hasRolled }]
}

export default useDice;