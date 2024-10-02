const caseClick = (position) => {
    return () => {
        console.log(position)
    }
}


const defineGridElementVariables = (wide, length) => {
    let gridElements = []
    for (let i = 1; i <= wide; i++) {
        let tmp = []
        for (let j = 1; j <= length; j++) {
            tmp.push(document.getElementById(`${i}-${j}`))
            document.getElementById(`${i}-${j}`).addEventListener('click', caseClick({ x: i, y: j }))
        }
        gridElements.push(tmp)
    }
    return gridElements
}


const createGrid = (wide, length) => {
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

const generateGrid = (wide, length) => {
    createGrid(wide, length)
    return defineGridElementVariables(wide, length)
}

const gridElements = generateGrid(10, 10)




