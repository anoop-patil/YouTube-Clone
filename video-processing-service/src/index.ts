import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const app = express();
app.use(express.json());

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

app.post('/process-video', (req, res) => {
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  if (!inputFilePath || !outputFilePath) {
    return res.status(400).send('Bad Request: Missing file path');
  }

  ffmpeg(inputFilePath)
    .outputOptions('-vf', 'scale=-1:360') // 360p
    .on('end', function() {
      console.log('Processing finished successfully');
      res.status(200).send('Processing finished successfully');
    })
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message);
      res.status(500).send('An error occurred: ' + err.message);
    })
    .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
