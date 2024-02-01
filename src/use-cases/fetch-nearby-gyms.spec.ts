import { inMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: inMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    // eslint-disable-next-line new-cap
    gymsRepository = new inMemoryGymsRepository()
    // eslint-disable-next-line new-cap
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -23.615397,
      longitude: -46.9125496,
    })
    await gymsRepository.create({
      title: 'For Gym',
      description: null,
      phone: null,
      latitude: -23.5578637,
      longitude: -46.6440029,
    })
    const { gyms } = await sut.execute({
      userLatitude: -23.615397,
      userLongitude: -46.9125496,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
