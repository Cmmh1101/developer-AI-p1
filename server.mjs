import express from "express";
import { ChatOllama } from "@langchain/ollama";
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const chatModel = new ChatOllama({
model: 'llama3.2'
});
app.post('/', async (request, response) => {
const streamIterator = await chatModel.stream("Can you tell me about the " +
"Beatles in 500 words or less?");
for await (const chunk of streamIterator) {
response.write(chunk.content);
}
response.end();
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000`);
});