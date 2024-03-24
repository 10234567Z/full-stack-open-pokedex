import React from 'react'
import { Route, useMatch, Routes } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import PokemonPage from './PokemonPage'
import PokemonList from './PokemonList'
import { useApi } from './useApi'

const mapResults = (({ results }) => results.map(({ url, name }) => ({
  url,
  name,
  id: parseInt(url.match(/\/(\d+)\//)[1])
})))

const App = () => {
  const match = useMatch('/pokemon/:name')
  const { data: pokemonList, error, isLoading } = useApi('https://pokeapi.co/api/v2/pokemon/?limit=50', mapResults)

  if (isLoading) {
    return <LoadingSpinner />
  }
  if (error) {
    return <ErrorMessage error={error} />
  }

  let next = null
  let previous = null

  if (match && match.params) {
    const pokemonId = pokemonList.find(({ name }) => name === match.params.name).id
    previous = pokemonList.find(({ id }) => id === pokemonId - 1)
    next = pokemonList.find(({ id }) => id === pokemonId + 1)
  }

  return (
    <Routes>
      <Route exact path="/" errorElement={<ErrorMessage />} element={<PokemonList pokemonList={pokemonList} />} />
      <Route path="/pokemon/:name" errorElement={<ErrorMessage />} element={<PokemonPage pokemonList={pokemonList} previous={previous} next={next} />} />
    </Routes>
  )
}

export default App
