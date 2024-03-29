const {
  S3Client,
  ListObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand
} = require("@aws-sdk/client-s3");
const express = require("express");
const multer = require("multer");
const { ProxyAgent }  = require("proxy-agent");
const { NodeHttpHandler } = require("@aws-sdk/node-http-handler");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const AWS_REGION = "ap-northeast-1";
const BUCKET_NAME = "ppppppppppppppppokemon"; // トレーナー情報を保存するバケット名

const agent = new ProxyAgent();
const s3Client = new S3Client({
  region: AWS_REGION,
  requestHandler: new NodeHttpHandler({
    httpAgent: agent,
    httpsAgent: agent,
  }),
});

// トレーナーのファイルリストを取得
router.get("/", async (req, res) => {
  try {
    const data = await s3Client.send(
      new ListObjectsCommand({ Bucket: BUCKET_NAME, Prefix: "trainers/" })
    );
    res.json(data.Contents.map((file) => file.Key));
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// トレーナー情報を取得
router.get("/:trainerName", async (req, res) => {
  const { trainerName } = req.params;
  const fileName = `trainers/${trainerName}.json`;
  try {
    const data = await s3Client.send(
      new GetObjectCommand({ Bucket: BUCKET_NAME, Key: fileName })
    );
    const stream = data.Body;
    stream.on("data", (chunk) => res.write(chunk));
    stream.on("end", () => res.end());
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send(err.message);
  }
});

// トレーナー情報を作成
router.post("/", async (req, res) => {
  const trainerData = req.body;
  const fileName = `trainers/${trainerData.name}.json`; // トレーナー名をファイル名とする
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: JSON.stringify(trainerData),
        ContentType: "application/json",
      })
    );
    res.status(201).send(`Trainer ${trainerData.name} created`);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send(err.message);
  }
});

// トレーナー情報をS3に上書き
router.put("/:trainerName", upload.single("file"), async (req, res) => {
  const { trainerName } = req.params;
  const fileName = `trainers/${trainerName}.json`;
  const file = req.body;
  try {
    const fileContent = JSON.stringify(file);
    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
      })
    );
    res.send(`File ${fileName} saved successfully`);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send(err.message);
  }
});

// トレーナーを削除
router.delete("/:trainerName", async (req, res) => {
  const { trainerName } = req.params;
  const fileName = `trainers/${trainerName}.json`;

  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName
    }));
    res.send(`Trainer ${trainerName} deleted successfully`);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send(err.message);
  }
});


module.exports = router;
