import type { NextFunction, Request, Response } from 'express';
declare const authmiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default authmiddleware;
//# sourceMappingURL=auth.d.ts.map