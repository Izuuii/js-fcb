// variables are storage of values

let board;
let score = 0;
let rows = 4;
let columns = 4;

//This variables will be used to assure that the player,
// - will be congratulated only one time after reaching 2048, 4096, or 8192
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

function setGame(){
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]; //Goal, is to use backend board to create frontend board.

    for(let r=0; r < rows; r++){
		for(let c=0; c < columns; c++){
			// create and design a tile
            // Created tile
			let tile = document.createElement("div");

            // each till will have an invisible id
			tile.id = r.toString() + "-" + c.toString();

            //number of the tile
			let num = board[r][c];

			updateTile(tile, num);

			document.getElementById("board").append(tile)
		}
	}

    setTwo();
    setTwo();
}


// updateTile() - updates the appearance of the tile 
//(that is should have tile number and background color)
function updateTile(tile, num){

	tile.innerText = "";
	tile.classList.value = "";

	tile.classList.add("tile");

    // updateTile() uses our prepared styles in css
	if(num > 0){
		tile.innerText = num.toString();
	
		if(num <= 4096){
			tile.classList.add("x"+ num.toString());
		}

		else{
			tile.classList.add("x8192");
		}
	}
}

window.onload = function(){
    setGame();
}

function handleSlide(event){
	console.log(event.code); //event.code - is the pressed key in our keyboard

    if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.code)){

        event.preventDefault();

        if(event.code == "ArrowLeft"){
            slideLeft();
            setTwo();

        }
        else if(event.code == "ArrowRight"){
            slideRight();
            setTwo();

        }
        else if(event.code == "ArrowUp"){
            slideUp();
            setTwo();

        }
        else if(event.code == "ArrowDown"){
            slideDown();
            setTwo();
        }

        document.getElementById("score").innerText = score;

	}
    checkWin();

    if(hasLost() == true){
		alert("Game Over! You have lost the game. Game will restart");
		restartGame();
		alert("Click any arrow key to restart");
	}
}

document.addEventListener("keydown", handleSlide);

function slideLeft(){

	for(let r=0; r<rows; r++){

		let row = board[r];

        let originalRow = row.slice(); 
        
		row = slide(row); //merge tiles with same values
		board[r] = row;

		for(let c = 0; c<columns; c++){

            //retrieve our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

            if(originalRow[c] !== num && num!==0){
				
				tile.style.animation = "slide-from-right 0.3s";
				setTimeout(()=> {
					tile.style.animation = "";
				}, 300);
			}

            // Updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}


function slideRight(){

	for(let r=0; r<rows; r++){

		let row = board[r];

        let originalRow = row.slice(); 
        row.reverse();
		row = slide(row); //merge tiles with same values
        row.reverse();

		board[r] = row;

		for(let c = 0; c<columns; c++){

            //retrieve our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

            if(originalRow[c] !== num && num!==0){
				
				tile.style.animation = "slide-from-left 0.3s";
				setTimeout(()=> {
					tile.style.animation = "";
				}, 300);
			}

            // Updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}


function slideUp(){

	for(let c=0; c<columns; c++){

		let col =  [board[0][c], board[1][c], board[2][c], board[3][c] ];
        
        let originalCol = col.slice();
		col = slide(col); //merge tiles with same values

        let changeIndices = [];
		for(let r=0; r<rows; r++){
			if(originalCol[r] !== col[r]){
				changeIndices.push(r);
			}
		}

		for(let r = 0; r<rows; r++){

            board[r][c] = col[r];
            //retrieve our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());
            
			let num = board[r][c];

            if(changeIndices.includes(r) && num!==0){
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}

            // Updates the appearance of the tile
			updateTile(tile, num);
		}
	}
}

function slideDown(){

	for(let c=0; c<columns; c++){

		let col =  [board[0][c], board[1][c], board[2][c], board[3][c] ];

        let originalCol = col.slice();

        col.reverse();
		col = slide(col); //merge tiles with same values
        col.reverse();

        let changeIndices = [];
		for(let r=0; r<rows; r++){
			if(originalCol[r] !== col[r]){
				changeIndices.push(r);
			}
		}

        let startX = 0;
        let startY = 0;

		for(let r = 0; r<rows; r++){

            board[r][c] = col[r];
            //retrieve our tile element
			let tile = document.getElementById(r.toString() + "-" + c.toString());
            
			let num = board[r][c];

            			// Animation Code:
			if(changeIndices.includes(r) && num!==0){
				tile.style.animation = "slide-from-top 0.3s";
				setTimeout(()=>{
					tile.style.animation = "";
				}, 300)
			}

            // Updates the appearance of the tile
			updateTile(tile, num);

		}
	}
}

function filterZero(row){
	return row.filter(num => num != 0);
}

// slide function merges the same adjacent tile
// Core function for sliding and merging tiles
function slide(row){
	row = filterZero(row);
	for(let i = 0; i<row.length - 1; i++){
		if(row[i] == row[i+1]){
			row[i] *= 2;
			row[i+1] = 0;
            score += row[i];
		}
	}

	// Add zeroes back
	while(row.length < columns){
		row.push(0); // 4 0 0 0 
	}
	return row;
}


  // hasEmptyTile checks the game board if it contains any empty (zero) tiles.
  function hasEmptyTile(){

    // loop
    for(let r=0; r<rows; r++){
        for(let c=0; c<columns; c++){
            if(board[r][c]==0){
            return true;
            }
        }
    }
    return false;
}

function setTwo(){

    // if hasEmptyTile() function returns false, the setTwo() function will not generate a new tile.
    if(hasEmptyTile() == false){
      return; // "I will do nothing, I don't need to generate a new tile"
    }

    // the codes below are the codes to be executed once the condition above is not satisfied. 
    let found = false;

    while(!found){

      // This is to generate a random row and column position to check a random tile, and generate a tile with number 2 in it.
      let r = Math.floor(Math.random() * rows);
      let c = Math.floor(Math.random() * columns);

      // if the random tile is an empty tile, the program will make it a tile with number 2. 
        if(board[r][c]==0){

        // the random vacant becomes 2 
        board[r][c] = 2;

        let tile = document.getElementById(r.toString() + "-" + c.toString());
        tile.innerText = "2";
        tile.classList.add("x2");

        found = true;
        }
    }
}

function checkWin(){
    for(let r=0; r < rows; r++){
        for(let c=0; c < columns; c++){

            if(board[r][c] == 2048 && is2048Exist == false){
				alert("You Win! You got 2048" );
				is2048Exist = true;
			}	
			else if(board[r][c] == 4096 && is4096Exist == false){
				alert("You are unstoppable at 4096!" );
				is4096Exist = true;
			}	
			else if(board[r][c] == 8192 && is8192Exist == false){
				alert("Victory! You have reached 8192! You are incredibly awesome" );
				is8192Exist = true;
			}
        }
    }
}

function hasLost(){
	for(let r=0; r < rows; r++){
		for(let c=0; c < columns; c++){

            //if there is an empty tile, the player
            //-is not yet lost the game
			if(board[r][c]==0){
				return false;
			}

			const currentTile = board[r][c];

			if(
				// check the current tile if it has a possible
                // -merge in its upper tile
				r > 0 && board[r-1][c] === currentTile ||
                // check the current tile if it has a possible
                // -merge in its lower tile
				r < rows - 1 && board[r+1][c] === currentTile ||
                // check the current tile if it has a possible
                // -merge in its left tile
				c > 0 && board[r][c-1] === currentTile ||
                // check the current tile if it has a possible
                // -merge in its right tile
				c < columns - 1 && board[r][c+1] === currentTile
			){
				return false;
			}
		}
	}
    return true;
}

// RestartGame by replacing all values into zero.
function restartGame(){
    // this loop is responsible to change each tiles value to zero.
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            board[r][c] = 0;    // change all values to 0
        }
    }

    score = 0;
    setTwo()    // new tile   
}

document.addEventListener('touchstart', (event) =>{
	startX = event.touches[0].clientX;
	startY = event.touches[0].clientY;
})

document.addEventListener('touchend', (event) => {

	if(!event.target.className.includes("tile")){
		return; // "I will do nothing, since you haven't touched a tile"
	}

	// touchstart - touchend
	let diffX = startX - event.changedTouches[0].clientX;
	let diffY = startY - event.changedTouches[0].clientY;

	if(Math.abs(diffX) > Math.abs(diffY)){
		if(diffX > 0 ){
			slideLeft();
			setTwo();
		}
		else{
			slideRight();
			setTwo();
		}
	}
	else{

		if(diffY > 0 ){
			slideUp();
			setTwo();
		}
		else{
			slideDown();
			setTwo();
		}

	}
    document.getElementById("score").innerText = score;

	checkWin();

	if(hasLost() == true){
		alert("Game Over! You have lost the game. Game will restart");
		restartGame();
		alert("Click any arrow key to restart");
	}
})

document.addEventListener('touchmove', (event)=>{
	if(!event.target.className.includes("tile")){
		return; // "I will do nothing, since the player/user does not touch a tile"
	}

	event.preventDefault();

}, {passive: false}); // Use passive: false, to make preventDefault() work
