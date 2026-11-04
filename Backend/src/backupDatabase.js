require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { spawn, spawnSync } = require("child_process");
const mongoose = require("mongoose");

function timestamp() {
    return new Date().toISOString().replace(/[:.]/g, "-");
}

async function main() {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI is required in Backend/.env");

    const requestedDirectory = process.env.BACKUP_DIR || path.join(__dirname, "../../backups");
    const outputDirectory = path.resolve(requestedDirectory, `eventsphere-${timestamp()}`);
    fs.mkdirSync(outputDirectory, { recursive: true });

    const mongodumpAvailable = spawnSync("mongodump", ["--version"], { stdio: "ignore" }).status === 0;
    if (mongodumpAvailable) {
        const dump = spawn("mongodump", ["--uri", mongoUri, "--out", outputDirectory], {
            stdio: ["ignore", "inherit", "inherit"],
        });

        await new Promise((resolve, reject) => {
            dump.once("error", reject);
            dump.once("close", (code) => {
                if (code === 0) resolve();
                else reject(new Error(`mongodump exited with status ${code}`));
            });
        });
        fs.writeFileSync(path.join(outputDirectory, "backup-manifest.json"), JSON.stringify({ format: "mongodump", createdAt: new Date().toISOString() }, null, 2));
        console.log(`Database BSON backup created at ${outputDirectory}`);
        return;
    }

    await mongoose.connect(mongoUri);
    const collections = await mongoose.connection.db.listCollections().toArray();
    const manifest = { format: "json-collections", createdAt: new Date().toISOString(), collections: [] };
    for (const { name } of collections) {
        const documents = await mongoose.connection.db.collection(name).find({}).toArray();
        fs.writeFileSync(path.join(outputDirectory, `${name}.json`), JSON.stringify(documents, null, 2));
        manifest.collections.push({ name, documents: documents.length });
    }
    fs.writeFileSync(path.join(outputDirectory, "backup-manifest.json"), JSON.stringify(manifest, null, 2));
    await mongoose.disconnect();
    console.log(`Database JSON backup created at ${outputDirectory} (mongodump was not available)`);
}

main().catch((error) => {
    console.error(`Database backup failed: ${error.message}`);
    process.exitCode = 1;
});
