import { Router, Request, Response } from "express";
import Message from "../model/Message";

const router = Router();

router.get("/teste", (req: Request, res: Response) => {
  res.status(200).send("API funcionando");
});

// Rota para criar uma nova mensagem
router.post("/messages", async (req: Request, res: Response) => {
  try {
    const { localizacao, categoria, subcategoria, foto } = req.body;

    const newMessage = new Message({
      foto,
      localizacao,
      categoria,
      subcategoria,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: "Erro ao salvar a mensagem", error });
  }
});

// Rota para buscar todas as mensagens
router.get("/messages", async (req: Request, res: Response) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar as mensagens", error });
  }
});

// Rota para adicionar um like a uma mensagem
router.post("/messages/:id/like", async (req: Request, res: Response) => {
  try {
    const messageId = req.params.id;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { $inc: { likes: 1 } },
      { new: true } // Retorna o documento atualizado
    );
    if (!message) {
      return res.status(404).json({ message: "Mensagem não encontrada" });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para adicionar um comentário a uma mensagem
router.post("/messages/:id/comment", async (req: Request, res: Response) => {
  try {
    const messageId = req.params.id;
    const { comment } = req.body;

    if (!comment) {
      return res
        .status(400)
        .json({ message: "Comentário não pode estar vazio" });
    }

    const message = await Message.findByIdAndUpdate(
      messageId,
      { $push: { comments: comment } }, // Adiciona o comentário no array
      { new: true } // Retorna o documento atualizado
    );
    if (!message) {
      return res.status(404).json({ message: "Mensagem não encontrada" });
    }
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 