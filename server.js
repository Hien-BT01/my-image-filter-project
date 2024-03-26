import bodyParser from 'body-parser'
import express from 'express'
import { deleteLocalFiles, filterImageFromURL } from './util/util.js'

// Init the Express application
const app = express()

// Set the network port
const port = process.env.PORT || 8082

const handleRequest = async (req, res) => {
  const image_url = req.query.image_url.toString()

  if (image_url.length === 0 || image_url === null) {
    res.status(400).send('url must be not null or empty')
  }

  const filterResult = await filterImageFromURL(image_url)

  res.status(200).sendFile(filterResult, () => {
    deleteLocalFiles([filterResult])
  })
}

// Use the body parser middleware for post requests
app.use(bodyParser.json())

app.get('/filteredimage', handleRequest)

// Root Endpoint
// Displays a simple message to the user
app.get('/', async (req, res) => {
  res.send('try GET /filteredimage?image_url={{}}')
})

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`)
  console.log(`press CTRL+C to stop server`)
})
