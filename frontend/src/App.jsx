import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Games() {
  const [videogames, setVideogames] = useState([])
  const [boardgames, setBoardgames] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3001/api/videogames') 
      .then(response => setVideogames(response.data))
      .catch(error => console.error('Error fetching videogames:', error))

    axios.get('http://localhost:3001/api/boardgames') 
      .then(response => setBoardgames(response.data))
      .catch(error => console.error('Error fetching boardgames:', error))
  }, [])

  return (
    <div>
      <h1>Videogames</h1>
      <ul>
        {videogames.map(game => (
          <li key={game.id}>{game.name} - <br/> Maximum amount of Players: {game.numplayers}</li>
        ))}
      </ul>

      <h1>Boardgames</h1>
      <ul>
        {boardgames.map(game => (
          <li key={game.id}>{game.name} - <br/> Maximum amount of Players: {game.numplayers}</li>
        ))}
      </ul>
    </div>
  )
}

export default Games
