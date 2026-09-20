/**
 * IBM watsonx.ai API Client
 * Handles IAM token refresh and text generation requests.
 */

const axios = require('axios');
const config = require('./config');

let cachedToken = null;
let tokenExpiry  = 0;

/**
 * Fetch a fresh IAM Bearer token (cached for ~50 min).
 */
async function getIAMToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'urn:ibm:params:oauth:grant-type:apikey');
  params.append('apikey', config.watsonx.apiKey);

  const response = await axios.post(config.watsonx.iamTokenUrl, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  cachedToken = response.data.access_token;
  // expire 5 min before actual expiry (3600 s)
  tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;
  return cachedToken;
}

/**
 * Call watsonx.ai text-generation endpoint.
 * @param {string} prompt  – full prompt string
 * @param {object} [opts]  – override maxTokens / temperature
 * @returns {string} generated text
 */
async function generateText(prompt, opts = {}) {
  const token = await getIAMToken();

  const maxTokens   = opts.maxTokens   || config.agent.maxTokens;
  const temperature = opts.temperature !== undefined ? opts.temperature : config.agent.temperature;

  // Build the watsonx.ai generation URL
  const baseUrl = config.watsonx.url.replace(/\/$/, '');
  const endpoint = `${baseUrl}/ml/v1/text/generation?version=2023-05-29`;

  const body = {
    model_id:   config.watsonx.modelId,
    project_id: config.watsonx.projectId,
    input:      prompt,
    parameters: {
      decoding_method: temperature === 0 ? 'greedy' : 'sample',
      max_new_tokens:  maxTokens,
      temperature:     temperature,
      repetition_penalty: 1.1,
      stop_sequences:  ['Human:', 'USER:', '\n\n---'],
    },
  };

  const response = await axios.post(endpoint, body, {
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept:         'application/json',
    },
    timeout: 60000,
  });

  const results = response.data?.results;
  if (!results || results.length === 0) {
    throw new Error('No results returned from watsonx.ai');
  }

  return results[0].generated_text.trim();
}

/**
 * List available models (utility / health-check).
 */
async function listModels() {
  const token   = await getIAMToken();
  const baseUrl = config.watsonx.url.replace(/\/$/, '');
  const endpoint = `${baseUrl}/ml/v1/foundation_model_specs?version=2023-05-29`;

  const response = await axios.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data?.resources || [];
}

module.exports = { generateText, listModels, getIAMToken };
