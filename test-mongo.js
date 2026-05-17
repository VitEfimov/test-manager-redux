require('dotenv').config({ path: './.env' });
const { MongoClient } = require('mongodb');

// Test 1: Standard connection
async function test1() {
  console.log("Test 1: Standard");
  const client = new MongoClient(process.env.MONGO_URI, { autoSelectFamily: false });
  try {
    await client.connect();
    console.log("Test 1 SUCCESS");
    await client.close();
  } catch (e) {
    console.log("Test 1 FAILED:", e.message);
  }
}

// Test 2: tls allow invalid certs
async function test2() {
  console.log("Test 2: Reject Unauthorized 0");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const client = new MongoClient(process.env.MONGO_URI, { autoSelectFamily: false });
  try {
    await client.connect();
    console.log("Test 2 SUCCESS");
    await client.close();
  } catch (e) {
    console.log("Test 2 FAILED:", e.message);
  }
}

async function run() {
    await test1();
    await test2();
}
run();
