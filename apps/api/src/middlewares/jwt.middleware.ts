import { Request, Response, NextFunction } from "express"
import { verify, JwtPayload  } from "jsonwebtoken"

type User = {
  id: string;
  username: string;
  email: string;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("AUTHORIZATION HEADER => ", req.header("Authorization"));
  
      const token = req.header("Authorization")?.replace("Bearer ", "");
  
      console.log("token --> ", token);
  
      if (!token) {
        return res.status(401).send("Unauthorized");
      }
  
      let verifyUser: string | JwtPayload;
      try {
        verifyUser = verify(token, "mySecretKey") as JwtPayload;
      } catch (err) {
        return res.status(401).send("Unauthorized");
      }
  
      if (!verifyUser) {
        return res.status(401).send("Unauthorized");
      }
  
      req.user = verifyUser as User;
      next();
    } catch (err) {
      console.log(err);
      return res.status(500).send("Please Login");
    }
  };

export const organizerGuard = async (req:Request, res:Response, next:NextFunction) => {
    try {
        if(req.user?.role != "Organizer"){
            return res.status(401).send("Unauthorized")
        }

        next()
    } catch (error) {
        console.log(error)
        return res.status(500).send("Please Login");
    }
}