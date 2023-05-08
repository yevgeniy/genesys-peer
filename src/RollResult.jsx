import react from 'react';

const RollResult = ({ succ, adv, tri, disp, dark, light }) => {
    return <div className='result-entry'>
        <div><b>Succ:</b> {succ}</div>
        <div><b>Adv:</b> {adv}</div>
        <div><b>Tri:</b> {tri}</div>
        <div><b>Disp:</b> {disp}</div>
        <div><b>Dark:</b> {dark}</div>
        <div><b>Light:</b> {light}</div>
    </div>
}

export default RollResult;