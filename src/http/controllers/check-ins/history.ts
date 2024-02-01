import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchUserCheckInHistoryUseCase } from '@/use-cases/factores/make-fetch-check-ins-history-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQueryParams = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQueryParams.parse(request.query)

  const fetchUserCheckinsHistoryUseCase = makeFetchUserCheckInHistoryUseCase()

  const { checkIns } = await fetchUserCheckinsHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}
