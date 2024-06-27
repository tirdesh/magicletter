// api/fetch-job-content.js
import axios from 'axios';
const axios = require('axios');

export default async (req, res) => {
    const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching job content:', error);
    res.status(500).send('Error fetching job content');
  }
};