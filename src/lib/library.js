function toSearchText(parts) {
  return parts
    .filter(Boolean)
    .join(' ')
    .toLocaleLowerCase('ru-RU')
}

export async function loadLibraryManifest() {
  const response = await fetch('/library/index.json', { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`manifest load failed: ${response.status}`)
  }

  const manifest = await response.json()
  return normalizeManifest(manifest)
}

export function normalizeManifest(manifest) {
  const artists = []
  const albums = []
  const tracks = []
  const artistById = new Map()
  const albumById = new Map()
  const trackById = new Map()

  for (const artist of manifest.artists ?? []) {
    const normalizedArtist = {
      id: artist.id,
      name: artist.name,
      photo: artist.photo ?? null,
      albums: [],
      searchText: toSearchText([artist.name]),
    }

    for (const album of artist.albums ?? []) {
      const normalizedAlbum = {
        id: album.id,
        artistId: normalizedArtist.id,
        artistName: normalizedArtist.name,
        folder: album.folder,
        year: album.year ?? null,
        title: album.title,
        cover: album.cover ?? null,
        totalDurationSec: album.totalDurationSec ?? null,
        totalDurationLabel: album.totalDurationLabel ?? null,
        tracks: [],
      }

      for (const track of album.tracks ?? []) {
        const normalizedTrack = {
          id: track.id,
          artistId: normalizedArtist.id,
          artistName: normalizedArtist.name,
          albumId: normalizedAlbum.id,
          albumTitle: normalizedAlbum.title,
          albumYear: normalizedAlbum.year,
          cover: normalizedAlbum.cover,
          no: track.no ?? null,
          title: track.title,
          durationSec: track.durationSec ?? null,
          durationLabel: track.durationLabel ?? null,
          file: track.file,
        }

        normalizedTrack.searchText = toSearchText([
          normalizedTrack.title,
          normalizedTrack.artistName,
          normalizedTrack.albumTitle,
        ])

        normalizedAlbum.tracks.push(normalizedTrack)
        tracks.push(normalizedTrack)
        trackById.set(normalizedTrack.id, normalizedTrack)
      }

      normalizedAlbum.searchText = toSearchText([
        normalizedAlbum.title,
        normalizedAlbum.artistName,
        normalizedAlbum.year,
      ])

      normalizedArtist.albums.push(normalizedAlbum)
      albums.push(normalizedAlbum)
      albumById.set(normalizedAlbum.id, normalizedAlbum)
    }

    artists.push(normalizedArtist)
    artistById.set(normalizedArtist.id, normalizedArtist)
  }

  return {
    manifest,
    artists,
    albums,
    tracks,
    artistById,
    albumById,
    trackById,
  }
}

export function searchInLibrary(value, entity) {
  const query = value.trim().toLocaleLowerCase('ru-RU')
  if (!query) return true
  return (entity.searchText ?? '').includes(query)
}
