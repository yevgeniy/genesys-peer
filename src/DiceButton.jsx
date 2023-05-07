import React from 'react';
import { useMemo } from 'react';
import { BiCheckbox } from 'react-icons/bi';



const DiceButton = ({ name }) => {

    const char = useMemo(() => {
        switch (name) {
            case 'boost': return 'j';
            case 'ability': return 'k';
            case 'proficiency': return 'l';
            case 'setback': return 'j';
            case 'difficulty': return 'k';
            case 'challenge': return 'l';
            case 'force': return <BiCheckbox />;
            case 'd100': return 'd100';
            case 'd10': return 'd10';
        }
    }, [name])

    if (name === 'd10' || name === 'd100')
        return <div className={`dice-button ${name}`} style={{ fontSize: '10px' }} >
            {char}
        </div>

    return <div className={`dice-button genesys ${name}`} >
        {char}
    </div>
}

export default DiceButton;