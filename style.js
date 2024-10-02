let gameStatus = false // false = game not started, true = game started

const gameConstants = {
    grid: {
        wide: 10,
        length: 10
    },
    minesNumber: 16,
    mines: [],
    flags: [],
    correctFlags: []
}
gridElements = []

function generateGame(position) {
    // Faire en sorte que la première case cliquée soit toujours vide ainsi que les 8 cases autour
    gameStatus = true
    // place the mines
    gameConstants.mines = []
    for (let i = 0; i < gameConstants.minesNumber; i++) {
        let minePosition = { x: Math.floor(Math.random() * gameConstants.grid.wide) + 1, y: Math.floor(Math.random() * gameConstants.grid.length) + 1 }
        if (!gameConstants.mines.find(mine => mine.x === minePosition.x && mine.y === minePosition.y) && !(minePosition.x === position.x && minePosition.y === position.y)) {
            gameConstants.mines.push(minePosition)
        }
    }
    console.log('Mines', gameConstants.mines)
    if (computeNumber(position) !== 0) {
        generateGame(position)
    }
}

function computeNumber(position) {
    let minesNumber = 0
    for (let i = position.x - 1; i <= position.x + 1; i++) {
        for (let j = position.y - 1; j <= position.y + 1; j++) {
            if (i > 0 && j > 0 && i <= gameConstants.grid.wide && j <= gameConstants.grid.length) {
                if (gameConstants.mines.find(mine => mine.x === i && mine.y === j)) {
                    minesNumber++
                }
            }
        }
    }
    gridElements[position.x - 1][position.y - 1].innerHTML = minesNumber
    if (minesNumber === 0) {
        for (let i = position.x - 1; i <= position.x + 1; i++) {
            for (let j = position.y - 1; j <= position.y + 1; j++) {
                if (i > 0 && j > 0 && i <= gameConstants.grid.wide && j <= gameConstants.grid.length) {
                    if (gridElements[i - 1][j - 1].classList.contains('unopened')) {
                        gridElements[i - 1][j - 1].classList.remove('unopened')
                        gridElements[i - 1][j - 1].classList.add('opened')
                        computeNumber({ x: i, y: j })
                    }
                }
            }
        }
    }
    return minesNumber
}

function caseRightClick(position) {
    console.log('case clicked', position)
    // Function executed when a case is clicked(position = { x, y })
    if (gameStatus) { //If the game already started
        if (
            gridElements[position.x - 1] && //If the x position is in the grid
            gridElements[position.x - 1][position.y - 1] && //If the y position is in the grid
            gridElements[position.x - 1][position.y - 1].classList.contains('unopened') //If the case is not already opened
        ) {
            gridElements[position.x - 1][position.y - 1].classList.remove('unopened') //We remove the unopened class
            gridElements[position.x - 1][position.y - 1].classList.add('opened') //We add the opened class
            if (gameConstants.mines.find(mine => mine.x === position.x && mine.y === position.y)) { //If the case is a mine
                gridElements[position.x - 1][position.y - 1].classList.add('mine') //We add the mine class
                alert('Game Over') //We display a message
                // We display all the mines
                gameConstants.mines.forEach(mine => {
                    mineEl = document.getElementById(`${mine.x}-${mine.y}`)
                    if (mineEl.innerHTML !== '🚩') {
                        mineEl.innerHTML = '💣'
                    } else {
                        mineEl.innerHTML = '🚩💣'
                    }
                })
                gameStatus = false //We stop the game
            } else {
                computeNumber(position) //Else, we compute the number of mines around the case
            }
        }

    }
    else { //Else, we start the game and generate the game
        generateGame(position)
        computeNumber(position)
        gridElements[position.x - 1][position.y - 1].classList.remove('unopened')
        gridElements[position.x - 1][position.y - 1].classList.add('opened')
        console.log('Game started')
    }
}

function caseLeftClick(position) {
    console.log('case clicked', position)
    let caca = document.getElementById(`${position.x}-${position.y}`)
    if (caca.classList.contains('opened')) {
        return
    }
    else if (caca.innerHTML === '🚩') {
        caca.innerHTML = ''
        gameConstants.flags = gameConstants.flags.filter(flag => flag.x !== position.x && flag.y !== position.y)
        if (gameConstants.mines.find(mine => mine.x === position.x && mine.y === position.y)) {
            gameConstants.correctFlags = gameConstants.correctFlags.filter(flag => flag.x !== position.x && flag.y !== position.y)
        }

    } else {
        caca.innerHTML = '🚩'
        gameConstants.flags.push(position)
        if (gameConstants.mines.find(mine => mine.x === position.x && mine.y === position.y)) {
            gameConstants.correctFlags.push(position)
        }
    }
    if (gameConstants.correctFlags.length === gameConstants.minesNumber) {
        alert('You win')
        gameStatus = false
    }
}

function createGrid(wide, length) {
    const grid = document.querySelector('.grid')
    grid.innerHTML = ''
    for (let i = 1; i <= wide; i++) {
        const row = document.createElement('div')
        row.classList.add('row')
        // set row id 
        row.id = `${i}`
        for (let j = 1; j <= length; j++) {
            const cell = document.createElement('div')
            cell.id = `${i}-${j}`
            cell.classList.add('cell')
            cell.classList.add('unopened')
            row.appendChild(cell)
        }
        grid.appendChild(row)
    }
    grid.style.gridTemplateRow = `repeat(${length}, 1fr)`
}

function defineGridElementVariables(wide, length) {
    let elements = []
    for (let i = 1; i <= wide; i++) {
        let tmp = []
        for (let j = 1; j <= length; j++) {
            tmp.push(document.getElementById(`${i}-${j}`))
        }
        elements.push(tmp)
    }
    return elements
}

function generateGrid(wide, length) {
    createGrid(wide, length)
    return defineGridElementVariables(wide, length)
}

function main() {
    gridElements = generateGrid(gameConstants.grid.wide, gameConstants.grid.length)
    // for each cell add click event
    gridElements.forEach((row, x) => {
        row.forEach((cell, y) => {
            cell.addEventListener('click', () => caseRightClick({ x: x + 1, y: y + 1 }))
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault()
                caseLeftClick({ x: x + 1, y: y + 1 })
            })
        })
    })
}

main()