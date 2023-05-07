import { useState } from "react";

const useDice = () => {

    const [set, setSet] = useState([])

    window.__diceIndexClicked = (dieIndex) => {
        setSet(v => {

            v.splice(dieIndex, 1);
            const newset = [...v];
            window.__diceBox.set_dice(newset);
            window.__diceBox.draw_selector();

            return newset;
        })
    }

    const clearDice = () => {
        console.log('clear')
        window.__diceBox.set_dice([]);
        window.__diceBox.clear();
        setSet([])
    }
    const addDie = name => {

        setSet(v => {
            const newset = [...v, name];
            console.log('a', newset)
            window.__diceBox.set_dice(newset);
            window.__diceBox.draw_selector();

            return newset;
        })
    }
    const roll = () => {
        window.__diceBox.start_throw(
            () => { /* notation getter */
                var ret = { set, constant: 0, result: [], error: false }
                return ret
            },
            (vectors, notation, callback) => { /* before roll */
                callback()
            },
            (notation, result) => { /* after roll */
                console.log('RESULT:', notation, result)
            }

        )
    }

    return [, { clearDice, addDie, roll }]
}

export default useDice;