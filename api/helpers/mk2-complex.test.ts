import 'dotenv/config'
import { describe, expect, it } from 'vitest'
import { findComplexForCinema } from './mk2-complex'

describe(findComplexForCinema.name, () => {
  it('finds mk2-bastille-cote-beaumarchais', () => {
    const slug = 'mk2-bastille-cote-beaumarchais'
    const complex = findComplexForCinema(slug)

    expect(complex?.slug).toBe('mk2-bastille-beaumarchais-fg-st-antoine')
  })

  it('finds mk2-gambetta', () => {
    const slug = 'mk2-gambetta'
    const complex = findComplexForCinema(slug)

    expect(complex?.slug).toBe('mk2-gambetta')
  })
})
