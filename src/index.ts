import express from 'express';
import { getRaceDetail, getRaceSummaries } from './scraper';

const app = express();
const port = process.env.PORT || 8080;

app.get('/races', async (req, res) => {
  console.log(`🏇 /races is called.`);
  const races = await getRaceSummaries();
  console.log(`🏇 finish. today race count: ${races.length}`);
  res.send(races);
});

app.get('/races/:raceId', async (req, res) => {
  console.log(`🏇 /races/${req.params.raceId} is called.`);

  const raceId = Number(req.params.raceId);
  if (isNaN(raceId)) throw Error('raceId is not a number.');

  const race = await getRaceDetail(raceId);
  console.log(`🏇 finish.`);
  res.send(race);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
