
import gameConstants from '../gameConstants.js';

export function lineCompleted(grid, tetromino) {
	const rows = getActualCoordinates(tetromino).reduce((prev, cur) => {
		return prev.hasOwnProperty(cur.y) ? Object.assign({}, prev, { [cur.y]: prev[cur.y] + 1 }) : Object.assign({}, prev, { [cur.y]: 1 });
	}, {});
	const lines = [];
	for (const i in rows) {
		let count = 0;
		for (let j = 0; j < 10; j++) {
			if (grid[j][i] === 'grey') {
				count++;
			}
		}
		if (count === rows[i]) {
			lines.push(i);
		}
	}
	return lines.length ? lines : false;
}
export function clearLines(grid, lines) {
	const gridCopy = grid.map((x) => [...x]);
	for (const i in lines) {
		const line = lines[i];
		for (let j = 0; j < 10; j++) {
			gridCopy[j][line] = 'grey';
		}
	}
	console.log(gridCopy);
	return gridCopy;
}
export function getNewGrid(grid, tetromino, color) {
	const res = grid.map((x) => [...x]);
	console.log(tetromino);
	for (let j = 0; j < tetromino.length; j++) {
		const { x, y } = tetromino[j];
		res[x][y] = color;
	}
	return res;
}

export function getActualCoordinates(newTetromino) {
	const coordinates = [];
	const { shape, offsetX, offsetY } = newTetromino;
	const { blockUnit } = gameConstants;
	for (let i = 0; i < shape.length; i++) {
		for (let j = 0; j < shape[i].length; j++) {
			if (shape[i][j]) {
				coordinates.push({ x: j + (offsetX / blockUnit), y: i + (offsetY / blockUnit) });
			}
		}
	}
	return coordinates;
}
export function rotateArray(tetromino) {
	const matrix = tetromino.shape;
	const n = matrix.length;
	const ret = [[], [], [], []];
	let closestX = 10;

	for (let i = 0; i < n; ++i) {
		for (let j = 0; j < n; ++j) {
			ret[i][j] = matrix[n - j - 1][i];
			if (ret[i][j]) {
				closestX = Math.min(closestX, j);
			}
		}
	}
	const fill = new Array(closestX).fill(0);
	for (let i = 0; i < n; ++i) {
		ret[i] = ret[i].slice(closestX).concat(fill);
	}
	return ret;
}
export function checkCollisions(direction, activeTetrominos, currentTetromino) {
	const { blockUnit } = gameConstants;
	const currentX = currentTetromino.offsetX / blockUnit;
	const currentY = currentTetromino.offsetY / blockUnit;
	let leftCollision = false;
	let rightCollision = false;
	let downCollision = false;
	let rotationCollision = false;
	let gameOver = false;

	for (let i = 0; i < currentTetromino.shape.length; i++) {
		for (let j = 0; j < currentTetromino.shape[i].length; j++) {
			const coord = currentTetromino.shape[i][j];
			if (coord) {
				if (j + currentX < 0 || i + currentY >= 22 || j + currentX >= 10) {
					rotationCollision = true;
				}
				if (((j - 1) + currentX) < 0 || activeTetrominos[(j + currentX) - 1][currentY + i] !== 'grey') {
					leftCollision = true;
				}
				if (((j + 1) + currentX) >= 10 || activeTetrominos[j + currentX + 1][currentY + i] !== 'grey') {
					rightCollision = true;
				}
				if (((i + 1) + currentY) >= 22 || activeTetrominos[j + currentX][currentY + i + 1] !== 'grey') {
					downCollision = true;
				}
				if (downCollision && currentY === 0) {
					gameOver = true;
				}
			}
		}
	}
	switch (direction) {
	case 'left':
		return leftCollision;
	case 'right':
		return rightCollision;
	case 'rotation':
		return rotationCollision;
	case 'down':
		if (gameOver) {
			return 'GAME_OVER';
		}
		return downCollision;
	default:
		return true;
	}
}



