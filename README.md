# Artificial Intelligence - Project

This is a frontend project for the Artificial Intelligence course.  
It consists of 2 parts.  
The first part visualizes search algorithms (BFS, DFS, Branch And Bound, A*).  
The second part is a game that demonstrates the functioning of algorithms for turn-based games (Minimax, Alpha Beta Pruning, Expectimax, Max^n).

This frontend communicates with the [backend](https://github.com/ensarhamzic/artificial-intelligence-backend), which processes the map using the mentioned algorithms and returns the next move.

Technologies:
- React.js
- JavaScript
- HTML
- CSS

### First part: Pathfinding
![Pathfinding](https://github.com/ensarhamzic/artificial-intelligence-client/blob/master/readme-assets/pytanja.png)

### Second part: Turn Based Game
![Pathfinding](https://github.com/ensarhamzic/artificial-intelligence-client/blob/master/readme-assets/pystolovina.png)

# Instructions

First part: Pathfinding
1. Choose an agent of your choice (each agent uses a different search algorithm - click on the ! next to the agent selection section to see the algorithm used by each).
2. Select the map size.
3. Choose the material for each field on the map (each material has a different cost - click on the ! next to the materials section to see the cost of each).
4. Add materijal with right click, or click Random to fill all fields randomly
5. Use the Drag and Drop gesture to place the agent at the desired starting position.
6. Use the Drag and Drop gesture to place the target X at the desired position.
7. Press the Spacebar on the keyboard to let the agent calculate the path and start moving along it.


# Second part: Turn Based Game

By clicking on Settings:
1. Choose the map size.
2. Select the number of human players: 0, 1, or 2.
3. Choose the algorithm for the student agent: off, minimax, alpha-beta pruning, expectimax, max^n.
4. Choose the algorithm for the teacher agents (optional).
5. Save settings

After saving settings:
1. Fill the map by right-clicking or use the Randomize Map option.
2. Click on Place Agents.
3. Click on Start Game.
4. Each player moves one square around themselves.
5. The game ends when the players no longer have any available squares to move to.

