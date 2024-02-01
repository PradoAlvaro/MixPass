import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeCreateGymsUseCase } from '@/use-cases/factores/make-create-gym-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const crateGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) < 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) < 180
    }),
  })

  const { title, description, phone, latitude, longitude } =
    crateGymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymsUseCase()

  await createGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  return reply.status(201).send()
}
