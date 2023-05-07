import { useState } from "react";

const addSuccess = (succ, adv, tri, disp, dark, light) => [++succ, adv, tri, disp, dark, light]
const addAdv = (succ, adv, tri, disp, dark, light) => [succ, ++adv, tri, disp, dark, light]
const removeSuccess = (succ, adv, tri, disp, dark, light) => [--succ, adv, tri, disp, dark, light]
const removeAdv = (succ, adv, tri, disp, dark, light) => [succ, --adv, tri, disp, dark, light]
const addTri = (succ, adv, tri, disp, dark, light) => [succ, adv, ++tri, disp, dark, light]
const addDisp = (succ, adv, tri, disp, dark, light) => [succ, adv, tri, ++disp, dark, light]
const addDark = (succ, adv, tri, disp, dark, light) => [succ, adv, tri, disp, ++dark, light]
const addLight = (succ, adv, tri, disp, dark, light) => [succ, adv, tri, disp, dark, ++light]


const parseResult = (dict, index) => {
    console.log('a', dict, index)
    dict = dict.filter(v => v !== '-')
    const entries = dict[index].trim().split('');
    console.log(entries)
    return entries.map(charEntry => {
        switch (charEntry) {
            case 's': return addSuccess;
            case 'a': return addAdv;
            case 'f': return removeSuccess;
            case 'h': return removeAdv;
            case 't': return addTri;
            case 'd': return addDisp;
            case '●': return addDark;
            case '○': return addLight;
        }
    })
}

const parseResults = (set, result) => {
    let succ = 0;
    let adv = 0;
    let disp = 0;
    let tri = 0;
    let dark = 0;
    let light = 0;

    const accumulators = []

    set.forEach((name, i) => {
        switch (name) {
            case 'boost':
                accumulators.push(...parseResult(window.boost_dice_labels, (+result[i]) - 1))
                break;
            case 'setback':
                accumulators.push(...parseResult(window.setback_dice_labels, (+result[i]) - 1))
                break;
            case 'ability':
                accumulators.push(...parseResult(window.ability_dice_labels, (+result[i]) - 1))
                break;
            case 'difficulty':
                accumulators.push(...parseResult(window.difficulty_dice_labels, (+result[i]) - 1))
                break;
            case 'proficiency':
                accumulators.push(...parseResult(window.proficiency_dice_labels, (+result[i]) - 1))
                break;
            case 'challenge':
                accumulators.push(...parseResult(window.challenge_dice_labels, (+result[i]) - 1))
                break;
            case 'force':
                accumulators.push(...parseResult(window.force_dice_labels, (+result[i]) - 1))
                break;
        }
    })

    accumulators.forEach(fn => {
        [succ, adv, tri, disp, dark, light] = fn(succ, adv, tri, disp, dark, light)
    })

    console.log({
        succ,
        adv,
        tri,
        disp,
        dark,
        light
    })

}

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
                parseResults(notation.set, result)
            }

        )
    }

    return [, { clearDice, addDie, roll }]
}

export default useDice;