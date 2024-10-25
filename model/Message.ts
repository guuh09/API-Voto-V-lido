import mongoose from 'mongoose';

// estrutura dos dados
const messageSchema = new mongoose.Schema({
  foto: String,
  localizacao: String,
  categoria: String,
  subcategoria: String,
  likes: { type: Number, default: 0 },
  comments: { type: [String], default: [] },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

export default Message;
