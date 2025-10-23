const Playlist = require("../models/Playlist")
const Cancion = require("../models/Cancion")
const PlaylistCancion = require("../models/Playlist_cancion.js")
const chalk = require("chalk")

// GET /playlists (listar playlists)
getPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.findAll({
      order: [["id_playlist", "ASC"]],
    })

    // --- Validar si hay playlists ---
    if (playlists.length === 0) {
      console.log(chalk.yellow("No se encontraron playlists"))
      return res.status(404).json({ message: "No se encontraron playlists" })
    }

    // --- Devolver resultados ---
    console.log(chalk.green(`Playlists obtenidos: ${playlists.length}`))
    return res.status(200).json({
      total: playlists.length,
      playlists,
    })
  } catch (error) {
    next(error)
  }
}

// GET /playlists/:id (obtener playlist por su ID)
getPlaylistByID = async (req, res, next) => {
  const { id } = req.params
  try {
    const playlist = await Playlist.findByPk(id)
    if (!playlist) {
      console.log(chalk.yellow("No se encontró la playlist"))
      return res.status(404).json({ message: "No se encontró la playlist" })
    }

    console.log(chalk.green(`Playlist obtenida correctamente`))
    return res.status(200).json(playlist)
  } catch (error) {
    next(error)
  }
}

// POST /playlists (crear playlist)
crearPlaylist = async (req, res, next) => {
  try {
    const { titulo, id_usuario } = req.body

    // --- Validar si falta algún campo ---
    const camposRequeridos = ["titulo", "id_usuario"]
    const camposFaltantes = camposRequeridos.filter(
      (campo) => !req.body[campo]
    )

    if (camposFaltantes.length > 0) {
      console.log(chalk.red(`Faltan campos requeridos: ${camposFaltantes}`))
      return res.status(400).json({
        error: "Faltan campos requeridos: " + camposFaltantes,
      })
    }

    // --- Validar que el usuario exista ---
    const usuario = await Usuario.findByPk(id_usuario)
    if (!usuario) {
      console.log(chalk.yellow(`Usuario con id ${id_usuario} no encontrado`))
      return res.status(404).json({ error: "Usuario no encontrado" })
    }

    // --- Crear playlist ---
    const playlist = await Playlist.create({
      titulo,
      id_usuario,
      cant_canciones: 0,
      estado: "Activa",
      fecha_creacion: new Date(),
      fecha_eliminada: null,
    })

    console.log(chalk.green(`Playlist creada correctamente`))
    res
      .status(201)
      .json({ message: "Playlist creada correctamente", playlist })
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      console.log(chalk.red(`Título existente para ese usuario`))
      return res.status(400).json({
        error: "Ya existe una playlist con ese titulo para ese usuario",
      })
    }
    return next(error)
  }
}

// PUT /playlists/:id (actualizar playlist)
updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params
    const { titulo, estado, fecha_eliminada } = req.body

    // --- Validar que la playlist existe ---
    const playlist = await Playlist.findByPk(id)
    if (!playlist) {
      console.log(chalk.yellow(`Playlist con id ${id} no encontrada`))
      return res.status(404).json({ error: "Playlist no encontrada" })
    }
    const estadosValidos = ["Activa", "Eliminada", "activa", "eliminada"]
    // --- Validar estado válido ---
    if (!estadosValidos.includes(estado)) {
      console.log(chalk.yellow(`Estado inválido: ${estado}`))
      return res.status(400).json({ error: "Estado inválido" })
    }

    // --- Validar si estado es 'Eliminada', debe enviarse fecha_eliminada ---
    if ((estado === "Eliminada" || estado === "eliminada") && !fecha_eliminada) {
      console.log(chalk.yellow("Falta fecha_eliminada en el body"))
      return res
        .status(400)
        .json({ error: "El campo fecha_eliminada es requerido" })
    }

    // --- Determinar fecha a guardar ---
    let nuevaFechaEliminada = fecha_eliminada // valor actual

    if (estado === 'Activa' || estado === 'activa') {
      nuevaFechaEliminada = null // Si es activa, borra la fecha
    }

    nuevaFechaEliminada = fecha_eliminada

    // --- Actualizar playlist ---
    await playlist.update({
      titulo,
      estado,
      fecha_eliminada: nuevaFechaEliminada,
    })

    const playlistActualizada = await Playlist.findByPk(id)

    // --- Devolver resultados ---
    console.log(chalk.green(`Playlist ${id} actualizada correctamente`))
    return res.status(200).json({
      message: "Playlist actualizada correctamente",
      playlistActualizada,
    })
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ error: "" })
    }
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ error: "Datos inválidos: " + error.message })
    }
    return next(error)
  }
}

// POST /playlists/:id/canciones { id_cancion, orden } (agregar canción a playlist)
agregarCancionAPlayList = async (req, res, next) => {
  try {
    const { id } = req.params
    const { id_cancion, orden } = req.body

    if (!id_cancion) {
      console.log(chalk.yellow("Falta id_cancion en el body"))
      return res
        .status(400)
        .json({ error: "El campo id_cancion es requerido" })
    }

    // --- Validar que la playlist existe ---
    const playlist = await Playlist.findByPk(id)
    if (!playlist) {
      console.log(chalk.yellow(`Playlist con id ${id} no encontrada`))
      return res.status(404).json({ error: "Playlist no encontrada" })
    }

    // --- Validar que la canción exista ---
    const cancion = await Cancion.findByPk(id_cancion)
    if (!cancion) {
      console.log(chalk.yellow(`Canción con id ${id_cancion} no encontrada`))
      return res.status(404).json({ error: "Canción no encontrada" })
    }

    // --- Validar si la canción ya está en la playlist ---
    const yaExiste = await PlaylistCancion.findOne({
      where: {
        id_playlist: id,
        id_cancion: id_cancion,
      },
    })
    if (yaExiste) {
      console.log(
        chalk.yellow(`La canción ${id_cancion} ya está en la playlist ${id}`)
      )
      return res
        .status(409)
        .json({ error: "Esta canción ya está en la playlist" })
    }

    // --- Agregar canción a playlist ---
    await PlaylistCancion.create({
      id_playlist: id,
      id_cancion: id_cancion,
      orden: orden,
    })

    // --- Actualizar cant_canciones ---
    await playlist.increment("cant_canciones", { by: 1 })

    const playlistActualizada = await Playlist.findByPk(id)

    console.log(
      chalk.green(
        `Canción ${id_cancion} agregada correctamente a la playlist ${id}`
      )
    )
    res
      .status(201)
      .json({
        message: "Canción agregada correctamente a la playlist",
        playlistActualizada,
      })
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ error: "Playlist o canción inválida" })
    }
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ error: "Datos inválidos: " + error.message })
    }
    return next(error)
  }
}

// DELETE /playlists/:id/canciones/:id_cancion (eliminar canción de playlist)
eliminarCancionDePlaylist = async (req, res, next) => {
  try {
    const { id, id_cancion } = req.params

    // --- Validar que la playlist exista ---
    const playlist = await Playlist.findByPk(id)
    if (!playlist) {
      console.log(chalk.yellow(`Playlist con id ${id} no encontrada`))
      return res.status(404).json({ error: "Playlist no encontrada" })
    }

    // --- Validar que la canción exista ---
    const cancion = await Cancion.findByPk(id_cancion)
    if (!cancion) {
      console.log(chalk.yellow(`Canción con id ${id_cancion} no encontrada`))
      return res.status(404).json({ error: "Canción no encontrada" })
    }

    // --- Validar si la canción está en la playlist ---
    const yaExiste = await PlaylistCancion.findOne({
      where: {
        id_playlist: id,
        id_cancion: id_cancion,
      },
    })
    if (!yaExiste) {
      console.log(
        chalk.yellow(`La canción ${id_cancion} no está en la playlist ${id}`)
      )
      return res
        .status(404)
        .json({ error: "Esta canción no está en la playlist" })
    }

    // --- Eliminar canción de playlist ---
    await PlaylistCancion.destroy({
      where: {
        id_playlist: id,
        id_cancion: id_cancion,
      },
    })

    // --- Actualizar cant_canciones ---
    await playlist.decrement("cant_canciones", { by: 1 })

    const playlistActualizada = await Playlist.findByPk(id)

    console.log(
      chalk.green(
        `Canción ${id_cancion} eliminada correctamente de la playlist ${id}`
      )
    )
    res
      .status(200)
      .json({
        message: "Canción eliminada correctamente de la playlist",
        playlistActualizada,
      })
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({ error: "Playlist o canción inválida" })
    }
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ error: "Datos inválidos: " + error.message })
    }
    return next(error)
  }
}

module.exports = {
  getPlaylists,
  getPlaylistByID,
  crearPlaylist,
  updatePlaylist,
  agregarCancionAPlayList,
  eliminarCancionDePlaylist,
}
