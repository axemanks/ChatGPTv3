// express server, handles api requests to openai
const { Configuration, OpenAIApi, createChatCompletion } = require("openai");
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);
const app = express()



app.use(bodyParser.json())
app.use(cors())

const port = process.env.PORT // 3080

app.post('/', async (req, res) => {
    const { message, currentModel } = req.body;
    console.log(message, currentModel)
// this is the old way to call - before turbo
    // const response = await openai.createCompletion({
    //     model: `${currentModel}`, //"text-davinci-003",
    //     prompt: `${message}`,
    //     max_tokens: 100,
    //     temperature: 0.5,
    //   });

    // new way to call completion - todo add a method to send chat history as messages
    const response = await openai.createChatCompletion({
        model: `${currentModel}`,
        messages: [
            { role: "system", content: "You are a helpful assistant." }, // this represents the bot and what role they will assume
            { role: "user", content: message }, // the message that the user sends
        ],
      });
   // old - response.data.choices[0].text - turbo -response.data.choices[0].message.content
    res.json({
    message: response.data.choices[0].message.content,
    })
    console.log(response.data.choices[0].message.content)
});

app.get('/models', async (req, res) => {
    const response = await openai.listModels();
        res.json({
        models: response.data
    })
       // console.log("🚀 ~ SERVER: index.js:52 ~ app.get ~ response:", response)
});

app.get('/', async (req, res) => {
    res.status(200).send({
        message: `Server running on port ${port}`
    }
    )
  })



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});