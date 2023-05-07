import { useState } from "react";

const useDice = () => {

    const [set, setSet] = useState([])

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

    return [, { clearDice, addDie }]
}

export default useDice;