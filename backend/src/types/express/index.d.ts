import "express"
declare global {
    namespace Express {
        interface Request {
            customUser?: {
                id: string,
                role: string,
                clinicId: string
            }
        }

    }
}