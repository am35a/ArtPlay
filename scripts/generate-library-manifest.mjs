import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { parseFile } from 'music-metadata'

const projectRoot = process.cwd()
const libraryFsRoot = path.join(projectRoot, 'public', 'library')
const outputPath = path.join(libraryFsRoot, 'index.json')

const COVER_REGEX = /^cover\.(jpg|jpeg|png|webp)$/i
const ARTIST_PHOTO_REGEX = /^(artist|author|photo|avatar|cover)\.(jpg|jpeg|png|webp)$/i
const AUDIO_EXTENSIONS = new Set(['.mp3'])

function stableId(prefix, source) {
  const hash = createHash('sha1').update(source).digest('hex').slice(0, 12)
  return `${prefix}_${hash}`
}

function toPosix(p) {
  return p.split(path.sep).join('/')
}

function toWebLibraryPath(absolutePath) {
  const rel = path.relative(libraryFsRoot, absolutePath)
  return `/library/${toPosix(rel)}`
}

function parseAlbumName(folderName) {
  const match = folderName.match(/^(\d{4})\s*-\s*(.+)$/)
  if (!match) {
    return { year: null, title: folderName }
  }

  return {
    year: Number(match[1]),
    title: match[2],
  }
}

function parseTrackName(fileName) {
  const baseName = path.parse(fileName).name
  const match = baseName.match(/^(\d+)\s*-\s*(.+)$/)
  if (!match) {
    return { no: null, title: baseName }
  }

  return {
    no: Number(match[1]),
    title: match[2],
  }
}

function byRuString(a, b) {
  return a.localeCompare(b, 'ru', { sensitivity: 'base' })
}

function formatDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds)) return null
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${String(hours)}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${String(minutes)}:${String(seconds).padStart(2, '0')}`
}

async function readDurationSec(absoluteFilePath) {
  try {
    const metadata = await parseFile(absoluteFilePath, { duration: true })
    const duration = metadata.format.duration
    if (!Number.isFinite(duration)) return null
    return Math.max(0, Math.round(duration))
  } catch {
    return null
  }
}

async function getDirectories(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(byRuString)
}

async function getFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort(byRuString)
}

async function buildManifest() {
  const artistFolders = await getDirectories(libraryFsRoot)
  const artists = []

  for (const artistFolder of artistFolders) {
    const artistPath = path.join(libraryFsRoot, artistFolder)
    const artistId = stableId('artist', artistFolder)
    const artistFiles = await getFiles(artistPath)
    const artistPhotoFile = artistFiles.find((file) => ARTIST_PHOTO_REGEX.test(file)) ?? null
    const artistPhoto = artistPhotoFile
      ? toWebLibraryPath(path.join(artistPath, artistPhotoFile))
      : null
    const albumFolders = await getDirectories(artistPath)
    const albums = []

    for (const albumFolder of albumFolders) {
      const albumPath = path.join(artistPath, albumFolder)
      const albumKey = `${artistFolder}/${albumFolder}`
      const albumId = stableId('album', albumKey)
      const { year, title } = parseAlbumName(albumFolder)
      const files = await getFiles(albumPath)

      const coverFile = files.find((file) => COVER_REGEX.test(file)) ?? null
      const cover = coverFile
        ? toWebLibraryPath(path.join(albumPath, coverFile))
        : null

      const trackFiles = files.filter((file) => {
        const ext = path.extname(file).toLowerCase()
        return AUDIO_EXTENSIONS.has(ext)
      })

      const tracks = []
      for (const file of trackFiles) {
        const parsed = parseTrackName(file)
        const trackKey = `${artistFolder}/${albumFolder}/${file}`
        const absoluteTrackPath = path.join(albumPath, file)
        const durationSec = await readDurationSec(absoluteTrackPath)

        tracks.push({
          id: stableId('track', trackKey),
          no: parsed.no,
          title: parsed.title,
          durationSec,
          durationLabel: formatDuration(durationSec),
          file: toWebLibraryPath(absoluteTrackPath),
        })
      }

      tracks.sort((a, b) => {
        const an = Number.isFinite(a.no) ? a.no : Number.MAX_SAFE_INTEGER
        const bn = Number.isFinite(b.no) ? b.no : Number.MAX_SAFE_INTEGER
        if (an !== bn) return an - bn
        return byRuString(a.title, b.title)
      })

      const totalDurationSec = tracks.reduce((sum, track) => {
        if (!Number.isFinite(track.durationSec)) return sum
        return sum + track.durationSec
      }, 0)

      albums.push({
        id: albumId,
        folder: albumFolder,
        year,
        title,
        cover,
        totalDurationSec,
        totalDurationLabel: formatDuration(totalDurationSec),
        tracks,
      })
    }

    albums.sort((a, b) => {
      const ay = Number.isFinite(a.year) ? a.year : Number.MAX_SAFE_INTEGER
      const by = Number.isFinite(b.year) ? b.year : Number.MAX_SAFE_INTEGER
      if (ay !== by) return ay - by
      return byRuString(a.title, b.title)
    })

    artists.push({
      id: artistId,
      name: artistFolder,
      photo: artistPhoto,
      albums,
    })
  }

  return {
    version: 4,
    generatedAt: new Date().toISOString(),
    libraryRoot: '/library',
    artists,
  }
}

async function main() {
  const manifest = await buildManifest()
  const json = `${JSON.stringify(manifest, null, 2)}\n`
  await fs.writeFile(outputPath, json, 'utf8')

  const albumCount = manifest.artists.reduce(
    (sum, artist) => sum + artist.albums.length,
    0
  )
  const trackCount = manifest.artists.reduce(
    (sum, artist) =>
      sum + artist.albums.reduce((inner, album) => inner + album.tracks.length, 0),
    0
  )

  console.log(
    `Manifest written: ${outputPath}\nartists=${manifest.artists.length} albums=${albumCount} tracks=${trackCount}`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
