import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { inMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/users-already-exists'

let usersRepository: inMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use case', () => {
  beforeEach(() => {
    // eslint-disable-next-line new-cap
    usersRepository = new inMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })
  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Alvaro',
      email: 'alvaro@gmail.com',
      password: '15551',
    })
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Amora',
      email: 'alvaa@hotmail.com',
      password: '1415226',
    })
    const isPasswordCorrectlyHashed = await compare(
      '1415226',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice ', async () => {
    const email = 'alvaa@hotmail.com'

    await sut.execute({
      name: 'Amora',
      email,
      password: '1415226',
    })

    await expect(() =>
      sut.execute({
        name: 'Amora',
        email,
        password: '1415226',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
