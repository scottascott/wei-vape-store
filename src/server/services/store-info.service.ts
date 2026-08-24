import { prisma } from "@/lib/prisma";
import type { StoreInfoInput } from "@/lib/validations/store-info.schema";

const SINGLETON_ID = "singleton";

export const storeInfoService = {
  get() {
    return prisma.storeInfo.findUnique({ where: { id: SINGLETON_ID } });
  },

  upsert(input: StoreInfoInput) {
    return prisma.storeInfo.upsert({
      where: { id: SINGLETON_ID },
      create: { id: SINGLETON_ID, ...input },
      update: input,
    });
  },
};
