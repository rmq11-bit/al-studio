import { prisma } from '@/lib/prisma'

/**
 * Get or create a conversation tied to a Direct Request.
 * Returns the conversation id.
 *
 * @param directRequestId - DirectRequest.id
 * @param clientId        - User.id of the consumer
 * @param photographerId  - PhotographerProfile.id
 */
export async function getOrCreateDirectRequestConversation(
  directRequestId: string,
  clientId: string,
  photographerId: string
): Promise<string> {
  const existing = await prisma.conversation.findFirst({
    where: { type: 'DIRECT_REQUEST', directRequestId },
    select: { id: true },
  })
  if (existing) return existing.id

  const conv = await prisma.conversation.create({
    data: {
      type: 'DIRECT_REQUEST',
      consumerId: clientId,
      photographerId,
      directRequestId,
    },
    select: { id: true },
  })
  return conv.id
}

/**
 * Get or create a conversation tied to a Project Bid.
 * Returns the conversation id.
 *
 * @param projectId      - ProjectPost.id
 * @param clientId       - User.id of the project owner (consumer)
 * @param photographerId - PhotographerProfile.id of the bidder
 */
export async function getOrCreateProjectBidConversation(
  projectId: string,
  clientId: string,
  photographerId: string
): Promise<string> {
  const existing = await prisma.conversation.findFirst({
    where: { type: 'PROJECT_BID', projectId, photographerId },
    select: { id: true },
  })
  if (existing) return existing.id

  const conv = await prisma.conversation.create({
    data: {
      type: 'PROJECT_BID',
      consumerId: clientId,
      photographerId,
      projectId,
    },
    select: { id: true },
  })
  return conv.id
}
