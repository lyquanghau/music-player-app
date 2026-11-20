const test = require("node:test");
const assert = require("node:assert/strict");
const rateLimit = require("../middleware/rateLimit");

test("limits repeated requests without blocking another client", () => {
  const limit = rateLimit(1, 60000);
  let accepted = 0;
  const next = () => { accepted += 1; };
  const response = {
    set(header, value) {
      assert.equal(header, "Retry-After");
      assert.ok(Number(value) > 0);
    },
    status(code) { assert.equal(code, 429); return this; },
    json(body) { assert.ok(body.message); },
  };
  limit({ ip: "first" }, response, next);
  limit({ ip: "first" }, response, next);
  limit({ ip: "second" }, response, next);
  assert.equal(accepted, 2);
});
