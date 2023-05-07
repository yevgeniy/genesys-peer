const useDice = () => {
    const clearDice = () => {
        console.log('clear')
        window.__diceBox.clear();
    }

    return [, { clearDice }]
}

export default useDice;