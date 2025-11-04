import { ChatPromptTemplate } from "@langchain/core/prompts";
// reusable mentor prompt
export const mentorPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a bilingual (Spanish-English) mentor helping women transition into tech. Be concise and actionable."],
  ["human", "User question: {question}"]
]);