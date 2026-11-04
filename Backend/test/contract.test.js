const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { spawn } = require("node:child_process");

const port = 4101;
const baseUrl = `http://127.0.0.1:${port}`;
let server;

async function request(path, options = {}) {
    const response = await fetch(`${baseUrl}${path}`, options);
    const text = await response.text();
    let body;
    try {
        body = JSON.parse(text);
    } catch {
        body = text;
    }
    return { response, body };
}

async function waitForServer(timeoutMs = 15000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        try {
            const { response } = await request("/");
            if (response.ok) return;
        } catch {
            // The database connection may still be starting.
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error("Backend did not become ready within 15 seconds");
}

before(async () => {
    server = spawn(process.execPath, ["src/index.js"], {
        cwd: __dirname.replace(/\/test$/, ""),
        env: { ...process.env, PORT: String(port), FRONTEND_URL: `http://127.0.0.1:${port + 1}` },
        stdio: "ignore",
    });
    await waitForServer();
});

after(() => {
    if (server && !server.killed) server.kill("SIGTERM");
});

test("health endpoint is available", async () => {
    const { response, body } = await request("/");
    assert.equal(response.status, 200);
    assert.equal(body, "Hello World");
});

test("public expo listing is reachable without authentication", async () => {
    const { response, body } = await request("/api/expo/getExpo");
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body), "public expo response should be an array");
});

test("protected endpoints reject missing authentication", async () => {
    const { response, body } = await request("/api/booth/getBooth");
    assert.equal(response.status, 401);
    assert.match(body.message, /login|authentication/i);
});

test("invalid login is rejected without exposing credentials", async () => {
    const { response, body } = await request("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "not-a-real-user@example.invalid", password: "Wrong@123" }),
    });
    assert.ok([401, 404].includes(response.status));
    assert.match(body.message, /invalid credentials/i);
    assert.equal(Object.prototype.hasOwnProperty.call(body, "token"), false);
});

test("malformed protected message input is rejected safely", async () => {
    const { response } = await request("/api/message/conversation/not-an-object-id", {
        headers: { Authorization: "Bearer malformed" },
    });
    assert.equal(response.status, 401);
});
