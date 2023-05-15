const addSuccess = (succ, adv, tri, disp, dark, light) => [++succ, adv, tri, disp, dark, light]
const addAdv = (succ, adv, tri, disp, dark, light) => [succ, ++adv, tri, disp, dark, light]
const removeSuccess = (succ, adv, tri, disp, dark, light) => [--succ, adv, tri, disp, dark, light]
const removeAdv = (succ, adv, tri, disp, dark, light) => [succ, --adv, tri, disp, dark, light]
const addTri = (succ, adv, tri, disp, dark, light) => [succ, adv, ++tri, disp, dark, light]
const addDisp = (succ, adv, tri, disp, dark, light) => [succ, adv, tri, ++disp, dark, light]
const addDark = (succ, adv, tri, disp, dark, light) => [succ, adv, tri, disp, ++dark, light]
const addLight = (succ, adv, tri, disp, dark, light) => [succ, adv, tri, disp, dark, ++light]

const parseResult = (dict, index) => {
    dict = dict.filter(v => v !== '-')
    const entries = dict[index].trim().split('');
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

export const dieUtilsParseResults = (set, result) => {
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


    return {
        succ,
        adv,
        tri,
        disp,
        dark,
        light
    }

}

export const dieUtilsGenerateRandoms =(set) => {
    return set.map(name=> {

        const [startingNumber, lastNumber] = window.__dice_face_range[name];
        const multiplyer=lastNumber+1-startingNumber /* look at __dice_face_range */
        console.log(name, multiplyer);

        return Math.min(Math.ceil( Math.random() * multiplyer ), multiplyer)
    })
}
