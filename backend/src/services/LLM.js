import { pipeline } from "@xenova/transformers";

let text2textPipeline = null;

/**
 * Load the Hugging Face model at startup
 */
export async function loadModel() {
  if (!text2textPipeline) {
    console.log("Loading model...");
    text2textPipeline = await pipeline(
      "text2text-generation",
      "Xenova/flan-t5-base"
    );
    console.log("Model loaded successfully");
  }
  return text2textPipeline;
}

/**
 * Generate suggested fix for an incident
 * @param {string} prompt
 * @returns {Promise<string>} suggested fix text
 */
export async function suggestFix(prompt) {
  if (!text2textPipeline) {
    throw new Error("Model not loaded yet");
  }
  const result = await text2textPipeline(prompt, { max_new_tokens: 1000 });
  return result;
}
