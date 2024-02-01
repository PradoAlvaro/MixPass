import { expect, describe, it, beforeEach } from 'vitest'
import { inMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: inMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticase Use case', () => {
  beforeEach(() => {
    // eslint-disable-next-line new-cap
    usersRepository = new inMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })
  it('should be able to authenticate', async () => {
    // eslint-disable-next-line new-cap

    await usersRepository.create({
      name: 'Amora',
      email: 'alvaro@gmail.com',
      password_hash: await hash('15551', 6),
    })

    const { user } = await sut.execute({
      email: 'alvaro@gmail.com',
      password: '15551',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    // eslint-disable-next-line new-cap

    await expect(() =>
      sut.execute({
        email: 'alvaro@gmail.com',
        password: '15551',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    // eslint-disable-next-line new-cap

    await expect(() =>
      sut.execute({
        email: 'alvaro@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
