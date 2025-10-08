# Developer Guide to AI - Project 1

## Steps to start with Ollama 
1. Install Ollama at: 
https://ollama.com
2. Start Ollama in the terminal (mac) easy way to watch logs later on
> ollama serve
3. Run Ollama (the first time takes longer)
> ollama run llama3.2

## Create and open a new project on VSC
1. Install or run Node
2. Check node version
> node -v
3. Initialize you project
4. Install the needed packages
    - Express
    - langchain
    - langchain/ollama
> npm install express langchain @langchain/ollama

## Create server file
- server.mjs

```mjs
import express from "express";
import { ChatOllama } from "@langchain/ollama";

const app = express();

const model = new ChatOllama({
    model: 'llama3.2'
});

app.get('/', async (req, res) => {
    const response = await model.invoke('Can you simply say "test"?');
    res.send(response.content);
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
```
start server: 
> node server.mjs

## install CORS middleware
> npm install cors

## Create an entire server file with Express
```mjs
import express from "express";
import { ChatOllama } from "@langchain/ollama";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
const chatModel = new ChatOllama({
model: 'llama3.2'
});
app.post('/', async (request, response) => {
const body = request.body;
const stream = await chatModel.stream(body.question);
for await (const chunk of stream) {
response.write(chunk.content);
}
response.end();
});
app.listen(8000, () => {
cons
```


