const matrixScrene = document.getElementById('matrix_screen')
const workSpace = document.getElementById('workspace')
const matrixTools = document.getElementById('matrix_tools')
const historySpace = document.getElementById('history_container')
const tdColorHover = 'rgb(41, 173, 129)'
const maxMatrixSize = 7
const primeNumbers = getPrimeNumbers(2000)
const matrix = {
    matrix: [[], [], [], [], [], []],
    height: [2, 2, 0, 0, 0, 0],
    width: [2, 2, 0, 0, 0, 0],
    name: ['A', 'B'],
    type: 0
}
//0, 1, 2
//_  _  _
//3, 4, 5 
window.addEventListener("load", (event) => {
    chooseSizeMatrix(0)
})

function chooseSizeMatrix(stage){
    matrixScrene.insertAdjacentHTML('beforeend',  showChooseSizeMatrix(stage, (matrix.type === 2 || matrix.type === 4) ? matrix.height[1] : maxMatrixSize ))
    
    const chooseSizeMatrixTd = document.querySelectorAll('#ChooseSizeMatrix > tbody > tr > td')
    const createMatrixBtn = document.getElementById('createMatrix')
    chooseSizeMatrixTd.forEach(item => {if(item.dataset.col < matrix.width[stage] && item.dataset.row < matrix.height[stage]) item.style.backgroundColor = tdColorHover})
    
    if (stage === 0){
        matrixTools.insertAdjacentHTML('beforeend', showTypeButtons())

        const typeBtn = document.querySelectorAll('.matrix_type_btn')
        selectBtn(typeBtn[0], true)
        let lastTypeBtnInd = 0

        typeBtn.forEach(item => {item.addEventListener('click', (item)=>{
            matrix.type=Number(item.target.dataset.type)
            selectBtn(typeBtn[lastTypeBtnInd], false)
            selectBtn(item.target, true)
            lastTypeBtnInd = item.target.dataset.type
        })}) 
    }
    chooseSizeMatrixTd.forEach(item => {
        item.addEventListener('click', (item) => {
            let toggleRow = Number(item.target.dataset.row)
            let toggleCol = Number(item.target.dataset.col)
            if(toggleRow + toggleCol < 1) {return }
            if (stage === 1 && (matrix.type === 2 || matrix.type === 4) && toggleRow+1 !== matrix.height[1]) {return }
            //define size for [0] and [3] or [1] and [4] matrix
            matrix.height[stage + 3] = matrix.height[stage] = toggleRow+1
            matrix.width[stage + 3] = matrix.width[stage] = toggleCol+1
            chooseSizeMatrixTd.forEach(td => {
                td.style.backgroundColor= (td.dataset.row <= toggleRow && td.dataset.col <= toggleCol) ? tdColorHover : 'transparent'
            })
        })
    })
    createMatrixBtn.addEventListener('click', () => {
        matrix.matrix[stage] = []
        for(let i = 0;i<matrix.height[stage];i++){
            let tmp1 = [], tmp2 = []
            for(let j = 0;j<matrix.width[stage];j++) {tmp1.push(0); tmp2.push(1)}
            //create matrix[stage] - numerator
            matrix.matrix[stage].push(tmp1)
            //create matrix[stage + 3] - denumerator
            matrix.matrix[stage + 3].push(tmp2)
        }
        createMatrixBtn.remove()
        document.getElementById('ChooseSizeMatrix').remove()
        document.getElementById('titleMatrix').remove()
        
        enterNumberInMatrix(stage)
    })
}
function enterNumberInMatrix(stage){
    matrixTools.innerHTML = `<p>Enter numbers in matrix ${matrix.name[stage]}</p>`
    matrixScrene.insertAdjacentHTML('beforeend', showEnterNumberMatrix(matrix.height[stage], matrix.width[stage]))
    
    const applyBtn = document.getElementById('applyMatrix')
    const insertMatrixInput = document.querySelectorAll('.matrix_input')
    const wrongItems = []
    insertMatrixInput.forEach(item => {item.addEventListener('input', (item) => {
        item.target.parentNode.classList.remove('btn_error')
        
        let ind = wrongItems.indexOf(item.target.dataset.index)
        if(ind !== -1) wrongItems.splice(ind, 1)
        if(notValidNumber(item.target.value)) {
            item.target.parentNode.classList.add('btn_error')
            wrongItems.push(item.target.dataset.index)
        }
    })})
    applyBtn.addEventListener('click', () => {
        if(wrongItems.length !== 0 || isEmptyItem(insertMatrixInput)) return
        for(let i = 0; i < matrix.height[stage];i++){
            for(let j = 0; j < matrix.width[stage];j++){
                let val = insertMatrixInput[i*matrix.width[stage]+j].value
                let tmp = val.split('/')
                if(tmp.length === 1) tmp.push(1)

                tmp = simplify(Number(tmp[0]), Number(tmp[1]))
                //update values for matrix.matrix[stage] and matrix.matrix[stage+3]
                matrix.matrix[stage][i][j] = tmp[0]
                matrix.matrix[stage+3][i][j] = tmp[1]
            }
        }
        document.getElementById('insertMatrix').remove()
        applyBtn.remove()
        matrixTools.childNodes.forEach(node => {node.remove()})
        
        if(stage === 0) {
            switch (Number(matrix.type)){
                case 0: 
                    matrix.height[2] = matrix.height[5] = matrix.height[0]
                    matrix.width[2] = matrix.width[5] = matrix.width[0]
                    stage = 1
                    break
                case 1: 
                    matrix.height[1] = matrix.height[2] = matrix.height[4] = matrix.height[5] = matrix.height[0]
                    matrix.width[1] = matrix.width[2] = matrix.width[4] =  matrix.width[5] = matrix.width[0]
                    
                    for(let i = 0;i<matrix.height[1];i++){
                        let tmp1 = [], tmp2 = []
                        for(let j = 0;j<matrix.width[1];j++) {tmp1.push(0); tmp2.push(1)}
                        matrix.matrix[1].push(tmp1)
                        matrix.matrix[4].push(tmp2)
                    }
                    enterNumberInMatrix(1)
                    break
                case 2:  
                    matrix.height[1] = matrix.height[4] = matrix.width[0]
                    matrix.height[2] = matrix.height[5] = matrix.height[0]
                    chooseSizeMatrix(1)
                    break
                case 3:
                    matrix.height[1] = matrix.height[2] = matrix.height[4] = matrix.height[5] = matrix.height[0]
                    matrix.width[1] = matrix.width[4] = matrix.width[0]

                    for(let i = 0;i<matrix.height[1];i++){
                        let tmp1 = [], tmp2 = []
                        for(let j = 0;j<matrix.width[1];j++) {
                            if (i === j) {tmp1.push(1)}
                            else {tmp1.push(0)}
                            tmp2.push(1)
                        }
                        matrix.matrix[1].push(tmp1)
                        matrix.matrix[4].push(tmp2)
                    }
                    stage = 1
                    break
                case 4:
                    matrix.height[1] = matrix.height[2] = matrix.height[4] = matrix.height[5] = matrix.height[0]
                    chooseSizeMatrix(1)
                    break
                }
        }
        if(stage === 1){
            generateMatrix()
        }
    })
}
function generateMatrix(){
    switch(matrix.type){
        case 0: 
            matrix.matrix[2] = matrix.matrix[0]
            matrix.matrix[5] = matrix.matrix[3]
            break
        case 1:
            for(let i = 0;i < matrix.height[2];i++){
                let tmp1 = [], tmp2 = []
                for(let j = 0;j < matrix.width[2];j++){
                    let simple = addFraction(
                        [matrix.matrix[0][i][j], matrix.matrix[3][i][j]], 
                        [matrix.matrix[1][i][j], matrix.matrix[4][i][j]]
                    )
                    tmp1.push(simple[0])
                    tmp2.push(simple[1])
                }
                matrix.matrix[2].push(tmp1)
                matrix.matrix[5].push(tmp2)
            }
            break
        case 2:
            matrix.width[2] = matrix.width[5] = matrix.width[1]
            for(let i = 0; i < matrix.height[0];i++){
                matrix.matrix[2].push([])
                matrix.matrix[5].push([])
                for(let j = 0; j < matrix.width[1];j++){
                    let tmp = [0, 1]
                    for(let k = 0;k < matrix.height[1];k++){
                        let simple = simplify(matrix.matrix[0][i][k] * matrix.matrix[1][k][j], matrix.matrix[3][i][k] * matrix.matrix[4][k][j])
                        tmp = addFraction(tmp, simple)
                    } 
                    matrix.matrix[2][i].push(tmp[0])
                    matrix.matrix[5][i].push(tmp[1])
                }
            }
            break
        case 3: 
        case 4:
            matrix.width[2] = matrix.width[5] = matrix.width[0] + matrix.width[1]
            for(let i = 0; i < matrix.height[2];i++){
                matrix.matrix[2].push(matrix.matrix[0][i].concat(matrix.matrix[1][i]))
                matrix.matrix[5].push(matrix.matrix[3][i].concat(matrix.matrix[4][i]))
            }
            break
        default:
            console.log('Умный дохуя')
    } 
    solutionMatrix()
}
function solutionMatrix(){
    console.log('Generation completed!!!')
    console.dir(matrix)

    matrixScrene.insertAdjacentHTML('beforeend', showFinalMatrix(matrix.height[2], matrix.width[2]))
    matrixTools.insertAdjacentHTML('beforeend', showMoveWorkSpace())
    const finalMatrix = document.getElementById('finalMatrix')
    const finalMatrixTd = document.querySelectorAll('#finalMatrix > tbody > tr > .td_watch')
    const applyMoveBtn = document.getElementById('applyMove')
    const swapMoveBtn = document.getElementById('swapMove')
    const inputNumber = document.getElementById('inputNumber')

    finalMatrixTd.forEach(item => {item.addEventListener('contextmenu', event => {event.preventDefault()})})
    let firstRow = -1, secondRow = -1

    finalMatrix.addEventListener('mousedown', (event) => {
        if(event.target.classList[0] === "td_watch") finalMatrixTd.forEach((item) => {
            let newIndex = selectTd(item, Number(event.target.dataset.row), event.button, firstRow, secondRow)
            firstRow = newIndex[0]
            secondRow = newIndex[1]
            changeMoveText(firstRow, secondRow)
        })
    })
    applyMoveBtn.addEventListener('click', (event) => {
        if(firstRow === -1){return }
        if(inputNumber.value.length === 0){return }
        if(notValidNumber(inputNumber.value)) {return }
        
        let tmp = inputNumber.value.split('/')
        if(tmp.length === 1) {tmp.push(1)}
        historySpace.insertAdjacentHTML('beforeend', updateHistory(firstRow, secondRow, tmp))

        for(let j = 0; j < matrix.width[2];j++){
            if(secondRow !== -1){
                let newFract = addFraction(
                    [matrix.matrix[2][secondRow][j], matrix.matrix[5][secondRow][j]],
                    [matrix.matrix[2][firstRow][j]*tmp[0], matrix.matrix[5][firstRow][j]*tmp[1]]
                    )
                matrix.matrix[2][secondRow][j] = newFract[0]
                matrix.matrix[5][secondRow][j] = newFract[1]
            }
            else{
                let simple = simplify(matrix.matrix[2][firstRow][j]*tmp[0], matrix.matrix[5][firstRow][j]*tmp[1])
                matrix.matrix[2][firstRow][j] = simple[0]
                matrix.matrix[5][firstRow][j] = simple[1]
            }
        }
        matrixScrene.innerHTML=''
        matrixTools.innerHTML=''
        solutionMatrix()
    })
    swapMoveBtn.addEventListener('click', (event) => {
        if(firstRow === -1 || secondRow === -1) {return }

        historySpace.insertAdjacentHTML('beforeend', updateHistory(firstRow, secondRow, 'swap'))
        for(let j = 0; j < matrix.width[2];j++){//swap
            let tmp = [0, 0]
            tmp[0] = matrix.matrix[2][firstRow][j]
            tmp[1] = matrix.matrix[5][firstRow][j]
            matrix.matrix[2][firstRow][j] = matrix.matrix[2][secondRow][j]
            matrix.matrix[5][firstRow][j] = matrix.matrix[5][secondRow][j]
            matrix.matrix[2][secondRow][j] = tmp[0]
            matrix.matrix[5][secondRow][j] = tmp[1]
        }

        matrixScrene.innerHTML=''
        matrixTools.innerHTML=''
        solutionMatrix()
    })
}

function notValidNumber(str){
    let cntSlash = 0
    for(let i = 0; i < str.length;i++){
        if(i === 0 && str[i] === '-') {continue }
        if(str[i] === '/') {
            cntSlash++
            if(cntSlash === 2){return true}
        }
        else if (isNaN(Number(str[i]))) {return true}
    }
    return false
}
function addFraction(num1, num2){
    return simplify(num1[0]*num2[1] + num2[0]*num1[1], num1[1]*num2[1])
}
function simplify(numerator, denumerator){
    if(denumerator === 1 || Math.abs(numerator) === 1){return [numerator, denumerator]}
    let contin = true
    while (contin){
        let change = false
        for(prime of primeNumbers){
            if(prime > Math.min(Math.abs(numerator), denumerator)){
                contin = false
                break
            }
            if(Math.abs(numerator) % prime === 0 && denumerator % prime === 0){
                numerator /= prime
                denumerator /= prime
                change = true
                break
            }
        }
        if(!change) {contin = false}
    }
    return [numerator, denumerator]
}
function getPrimeNumbers(maxVal){
    let tmp = [2]
    for(let i = 3; i < maxVal;i+=2){
        let isPrime = true
        for(j of tmp){
            if(i % j === 0){isPrime = false; break}
        }
        if(isPrime){tmp.push(i)}
    }
    return tmp
}

function isEmptyItem(arr){
    for(let item of arr){
        if(item.value.length === 0) return true
    }
    return false
}

function selectBtn(item, isSelected){
    if(isSelected){
        item.classList.add("btn_selected")
    }else{
        item.classList.remove("btn_selected")
    }
}
function selectTd(item, row, typeBtn, fRow, sRow){
    let newF = fRow, newS = sRow
    if (Number(item.dataset.row) === row){
        switch(typeBtn){
            case 0:
                item.classList.add('td_watch_hover_lmb')
                item.classList.remove('td_watch_hover_rmb')
                newF = row
                if(sRow === row) newS = -1
                break
            case 2:
                item.classList.add('td_watch_hover_rmb')
                item.classList.remove('td_watch_hover_lmb')
                newS = row
                if(fRow === row) newF = -1
                break
        }
    }
    else{
        switch(typeBtn){
            case 0:
                item.classList.remove('td_watch_hover_lmb')
                break
            case 2:
                item.classList.remove('td_watch_hover_rmb')
                break
        }
    }
    return [newF, newS]
}
function getDet(mat, height, width){
    if(height !== width) return 'NaN'
    if(height === 2) return mat[0][0]*mat[1][1] - mat[0][1]*mat[1][0]
    let sum = 0
    for(let i = 0; i < height;i++){
        let newmat = []
        for(let y = 0; y < height;y++){
            if(y === i) continue
            let tmp = []
            for(let x = 1;x < width;x++){
                tmp.push(mat[y][x])
            }
            newmat.push(tmp)
        }
        sum += (-1)**(i) * mat[i][0] * getDet(newmat, height-1,width-1)
    }
    return sum
}
function getTd(matr1, matr2, row, col, decor='$'){
    let attr = (matr2[row][col] === 1 || matr1[row][col] === 0) ? '' : 'span_fraction'
    let text = (matr2[row][col] === 1 || matr1[row][col] === 0) ? matr1[row][col] : `${matr1[row][col]}<br/><hr/>${matr2[row][col]}`
    return `<td data-row="${row}" data-col="${col}" class="${decor === '$' ? 'td_watch ' : ('history_td ' + decor)} ${attr}">${text}</td>`
}
function changeMoveText(firstRow, secondRow){
    document.getElementById('move_firstRow').innerHTML='[' + String(firstRow+1) + ']'
    document.getElementById('move_secondRow').innerHTML='[' + String(secondRow+1) + ']'
}
function showChooseSizeMatrix(stage, height){
    let table = `
        <p id="titleMatrix">Choose size ${matrix.name[stage]}</p>
        <table id="ChooseSizeMatrix">`
    for(let i = 0; i < height;i++){
        table += '<tr>'
        for(let j = 0; j < maxMatrixSize;j++){
            table += `<td data-row="${i}" data-col="${j}"> </td>`
        }
        table += '</tr>'
    }
    table += `
        </table>
        <button id="createMatrix">Enter</button> `
    return table
}

function showEnterNumberMatrix(height, width){
    let table = ''
    for(let i = 0;i < height; i++){
        let row = '<tr>'
        for(let j = 0; j < width; j++){
            row += `<td><input type="text" class="matrix_input" data-index="${i*height + j}"></td>`
        }
        row += '</tr>'
        table += row
    }
    return `
        <table id="insertMatrix">
            ${table}
        </table>
        <button id="applyMatrix">Ready</button>
    `
}

function showTypeButtons(){
    return `
        <p id="typeMatrixP">Choose type</p>
        <div class="matrix_tools_btn" id="typeMatrixBtns">
            <p><button class="matrix_type_btn" data-type="0">(A)</button> - elementary transformations</p>
            <p><button class="matrix_type_btn" data-type="1">(A)+(B)</button> - matrix addition</p>
            <p><button class="matrix_type_btn" data-type="2">(A)*(B)</button> - matrix multiplication</p>
            <p><button class="matrix_type_btn" data-type="3">(A|E)</button> - adjacent to the unit matrix</p>
            <p><button class="matrix_type_btn" data-type="4">(A|B)</button> - adjacent to the B matrix</p>
        </div>
    `
}
function showFinalMatrix(height, width, MatrixIndex=2){
    let table = '', det = ''
    for(let i = 0;i < height; i++){
        let row = '<tr>'
        for(let j = 0; j < width; j++){
            row += getTd(matrix.matrix[MatrixIndex], matrix.matrix[MatrixIndex+3], i, j)
            if((matrix.type === 3 || matrix.type === 4) && j+1 === matrix.width[0]) row += '<td class="td_wall"> | </td>'
        }
        row += '</tr>'
        table += row
    }
    if(matrix.type === 0){det = `<p class="determined">det A = ${getDet(matrix.matrix[0], matrix.height[0], matrix.width[0])}</p>`}
    return `
        <table id="finalMatrix">
            ${table}
        </table>
        ${det}
    `
}
function showMoveWorkSpace(){
    return  `
    <div class="move_wrapper"> 
        <p>
            Lclick on a cell to select first row <br/>
            Rclick on a cell to select second row
        </p>
        <div class="move_text">
            <p>row: </p>
            <p id="move_firstRow" class="span_watch_hover_lmb">[-1]</p>
            <p>&times;</p>
            <input type="text" class="move_input" placeholder="1" id="inputNumber">
            <p> will be added to row:</p>
            <p id="move_secondRow" class="span_watch_hover_rmb">[-1]</p>
        </div>
        <button id="applyMove">Apply</button>
        <button id="swapMove">Swap</button>
    </div>`
}
function updateHistory(fRow, sRow, num){
    let matr = ""
    for(let i = 0; i < matrix.height[2];i++){
        let decor = ''
        if(i === sRow) decor = 'td_watch_hover_rmb'
        if(i === fRow) decor = 'td_watch_hover_lmb'
        if(sRow === -1) sRow = fRow
        
        matr += '<tr class="history_tr">'
        for(let j = 0; j < matrix.width[2];j++){
            matr += getTd(matrix.matrix[2], matrix.matrix[5], i, j, decor)
        }
        matr += '</tr>'
    }
    let strNum = ''
    if(num === 'swap'){ strNum = " ⇄ "}
    else{
        strNum += ' &times; ' 
        if (num[0] < 0) { strNum += '('}
        if (num[1] === 1){
            strNum += num[0]
        }else {
            strNum += num[0] + '/' + num[1]
        }
        if (num[0] < 0) { strNum += ')'}
        strNum += ' + '
    }
    return `
    <div class="history_item">
        <table>
        ${matr}
        </table>
        <p><span class="span_watch_hover_lmb">[${fRow}]</span> ${strNum}<span  class="span_watch_hover_rmb">[${sRow}]</span></p>
        <hr/>
    </div>`
}