import mongoose from 'mongoose';
import dotenv from 'dotenv'

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('MongoDB Atlas conectado com sucesso!')
  } catch (error) {
    console.log("Erro ao conectar ao MongoDB:", error)
  }
}

