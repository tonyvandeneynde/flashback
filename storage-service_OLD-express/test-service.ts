import amqp from "amqplib/callback_api";
import fs from "fs";
import path from "path";

const testFilePath1 = path.join(__dirname, "testimage1.JPG");
const testFileBuffer1 = fs.readFileSync(testFilePath1);

const testFilePath2 = path.join(__dirname, "testimage2.JPG");
const testFileBuffer2 = fs.readFileSync(testFilePath2);

const message = {
  uploadId: "test-upload-id",
  files: [
    {
      filename: "multi-test-1.jpg",
      buffer: testFileBuffer1,
      mimetype: "image/jpeg",
    },
    {
      filename: "multi-test-2.jpg",
      buffer: testFileBuffer2,
      mimetype: "image/jpeg",
    },
  ],
};

amqp.connect("amqp://localhost:5672", (err, conn) => {
  if (err) throw err;
  conn.createChannel((err, ch) => {
    if (err) throw err;
    const queue = "image_uploads";
    ch.assertQueue(queue, { durable: true });
    ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log("Test message sent to queue");
    setTimeout(() => {
      conn.close();
      process.exit(0);
    }, 500);
  });
});
