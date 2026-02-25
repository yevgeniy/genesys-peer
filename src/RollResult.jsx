import react from 'react';

function Success({succ}) {
    if (succ>=0)
        return <div ><b className="genesys ability">s</b> {succ}</div>
    return <div ><b className="genesys difficulty">f</b> {Math.abs(succ)}</div>
}
function Advantage({adv}) {
    if (adv>=0)
        return <div ><b className="genesys proficiency">a:</b> {adv}</div>
    return <div ><b className="genesys challenge">h</b> {Math.abs(adv)}</div>

}

const RollResult = ({ succ, adv, tri, disp, dark, light }) => {
    return <div className='result-entry'>
        <Success succ={succ}/>
        <Advantage adv={adv} />
        
        
        <div><b>t</b> {tri}</div>
        <div><b>d</b> {disp}</div>
        <div><b>●</b> {dark}</div>
        <div><b>○</b> {light}</div>
    </div>
}

export default RollResult;