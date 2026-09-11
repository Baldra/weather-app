import { useEffect, useState } from 'react'
import type { Country } from '../types/weather'

import { fetchCountries } from '../services/countriesApi'

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let isMounted = true

    fetchCountries()
      .then((result) => {
        if (isMounted) {
          setCountries(result)
        }
      })
      .catch((loadError) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Failed to load countries.'
          )
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { countries, error }
}
