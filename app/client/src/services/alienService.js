/*
* Esta función toma un arreglo de aliens, el hash de celdas, y el board del comienzo
* de la partida. Luego, actualiza el arreglo de aliens con la posición. Si existe
* el alien, actualiza su posición. Si no existe, lo agrega.
* Tambien actualiza el board con la informacion del hash.
*/

export const handleHash = (aliens, cells, newBoard) => {
  Object.entries(cells).forEach(([position, cell]) => {
    const [row, col] = position.slice(1, -1).split(', ').map(Number)

    cell.aliens.forEach((cellAlien) => {
      const alien = aliens.find(alien => alien.id === cellAlien.id)

      if (alien) {
        // si el alien ya existe en la lista, actualiza su posición
        alien.oldPosition = { ...alien.newPosition }
        alien.newPosition = { row, col }
      } else {
        // si el alien no existe en la lista, lo agrego
        aliens.push({
          id: cellAlien.id,
          oldPosition: { row, col },
          newPosition: { row, col }
        })
      }
    })

    newBoard[row][col] = cell
  })
}

/*
* Toma el arreglo de aliens, con posiciones antiguas y nuevas, y devuelve un
* arreglo de id con la direccion.
*/

export const getAliensDirections = (aliens) => {
  return aliens.map(alien => {
    let direction

    if (alien.oldPosition.row < alien.newPosition.row) {
      direction = 'down'
    } else if (alien.oldPosition.row > alien.newPosition.row) {
      direction = 'up'
    } else if (alien.oldPosition.col < alien.newPosition.col) {
      direction = 'right'
    } else if (alien.oldPosition.col > alien.newPosition.col) {
      direction = 'left'
    } else {
      direction = 'none'
    }
    return { id: alien.id, direction }
  })
}
