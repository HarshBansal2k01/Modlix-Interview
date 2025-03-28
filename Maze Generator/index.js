function generateMaze(N, M) {
  if (N % 2 === 0 || M % 2 === 0) {
    throw new Error("N and M must be odd numbers.");
  }

  let maze = Array.from({ length: N }, () => Array(M).fill("#"));

  function carvePath(x, y) {
    maze[x][y] = ".";

    let directions = [
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0],
    ];
    directions.sort(() => Math.random() - 0.5);

    for (let [dx, dy] of directions) {
      let nx = x + dx,
        ny = y + dy;
      if (
        nx > 0 &&
        nx < N - 1 &&
        ny > 0 &&
        ny < M - 1 &&
        maze[nx][ny] === "#"
      ) {
        maze[x + dx / 2][y + dy / 2] = ".";
        carvePath(nx, ny);
      }
    }
  }

  carvePath(1, 1);

  maze[1][0] = "S";
  maze[N - 2][M - 1] = "E";

  return maze;
}

function findShortestPath(maze) {
  let N = maze.length,
    M = maze[0].length;
  let directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  let start, end;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      if (maze[i][j] === "S") start = [i, j];
      if (maze[i][j] === "E") end = [i, j];
    }
  }

  let queue = [[...start, []]];
  let visited = new Set();
  visited.add(start.join(","));

  while (queue.length) {
    let [x, y, path] = queue.shift();
    let newPath = [...path, [x, y]];

    if (x === end[0] && y === end[1]) return newPath;

    for (let [dx, dy] of directions) {
      let nx = x + dx,
        ny = y + dy;
      if (
        nx >= 0 &&
        nx < N &&
        ny >= 0 &&
        ny < M &&
        maze[nx][ny] !== "#" &&
        !visited.has(`${nx},${ny}`)
      ) {
        queue.push([nx, ny, newPath]);
        visited.add(`${nx},${ny}`);
      }
    }
  }
  return null;
}

function printMaze(maze, path = []) {
  let mazeCopy = maze.map((row) => [...row]);

  for (let [x, y] of path) {
    if (mazeCopy[x][y] !== "S" && mazeCopy[x][y] !== "E") mazeCopy[x][y] = "*";
  }

  console.log(mazeCopy.map((row) => row.join("")).join("\n"));
}

// Generate Maze
let N = 7,
  M = 7;
let maze = generateMaze(N, M);

// Find the shortest path
let shortestPath = findShortestPath(maze);

// Print the Maze with the solution path
console.log("Generated Maze:");
printMaze(maze);
console.log("\nShortest Path Solution:");
if (shortestPath) {
  printMaze(maze, shortestPath);
  console.log(shortestPath.map(([x, y]) => `(${x},${y})`).join(" -> "));
} else {
  console.log("No solution found.");
}
