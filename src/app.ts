import express, { Request, Response } from "express";
import config from "config";
import cors from "cors";
import db from "../config/db";
import router from "./router";
import multer, { StorageEngine } from "multer"; 
import path from "path";


const app = express();
app.use(cors());
app.use(express.json());


const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "uploads/"); 
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage }); 


app.post(
  "/api/upload",
  upload.single("image"),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem foi enviada." });
    }

    const imageUrl = `/uploads/${req.file.filename}`; 
    return res.status(201).json({ imageUrl }); 
  }
);


app.use("/uploads", express.static("uploads"));


app.use("/api", router);


const port = config.get<number>("port");

app.listen(port, async () => {
  await db();
  console.log(`app rodando na porta ${port}`);
});

console.log("teste");