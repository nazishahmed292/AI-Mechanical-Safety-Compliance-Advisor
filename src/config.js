require('dotenv').config();

const config = {
  watsonx: {
    apiKey:    process.env.WATSONX_API_KEY    || 'cStqXupfT2FC1jqTBLWH5K9pVqS_kahcvSTJ0eUpmCuNURL',
    url:       process.env.WATSONX_URL        || 'https://au-syd.ml.cloud.ibm.com',
    modelId:   process.env.WATSONX_MODEL_ID   || 'ibm/granite-4-h-small',
    projectId: process.env.WATSONX_PROJECT_ID || 'a869ea08-6524-48a0-9d27-c598eb1ee4b2',
    iamTokenUrl: process.env.IAM_TOKEN_URL    || 'https://iam.cloud.ibm.com/identity/token',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    env:  process.env.NODE_ENV || 'development',
  },
  agent: {
    name:        process.env.AGENT_NAME  || 'Mechanical Safety Compliance Advisor',
    maxTokens:   parseInt(process.env.MAX_TOKENS  || '2048', 10),
    temperature: parseFloat(process.env.TEMPERATURE || '0.2'),
  },
};

module.exports = config;
