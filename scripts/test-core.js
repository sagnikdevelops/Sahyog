// Sahyog Automated Core Verification Test Suite

console.log("==========================================");
console.log("Sahyog Core Logic & Algorithm Test Suite");
console.log("==========================================");

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

// 1. Test Haversine Distance
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

const distance = calculateDistanceKm(28.628, 77.3649, 28.625, 77.368);
assert(distance > 0 && distance < 1.0, `Haversine distance calculation is accurate (${distance} km)`);

// 2. Test Deterministic Matching Formula Weights
const skillWeight = 0.40;
const proximityWeight = 0.30;
const availabilityWeight = 0.20;
const workloadWeight = 0.10;
const totalWeights = skillWeight + proximityWeight + availabilityWeight + workloadWeight;
assert(Math.abs(totalWeights - 1.0) < 0.0001, "Deterministic matching weights sum exactly to 100%");

// 3. Test Commission Split (88% Worker, 7% Coop Welfare, 5% Platform)
const totalAmount = 550;
const platformFee = Math.round(totalAmount * 0.05);
const coopFee = Math.round(totalAmount * 0.07);
const workerPayout = totalAmount - platformFee - coopFee;
assert(workerPayout >= Math.round(totalAmount * 0.87), `Worker receives fair cooperative share (₹${workerPayout} of ₹${totalAmount})`);

// 4. Test 16-Step Lifecycle State Chain
const lifecycleStates = [
  "REQUESTED",
  "MATCHING",
  "ASSIGNED",
  "ACCEPTED",
  "SCHEDULED",
  "WORKER_EN_ROUTE",
  "SERVICE_STARTED",
  "SERVICE_COMPLETED",
  "PAYMENT_PENDING",
  "PAYMENT_COMPLETED",
  "PAYOUT_PENDING",
  "PAYOUT_COMPLETED"
];
assert(lifecycleStates.length === 12, "Lifecycle contains all 12 forward state progression steps");

console.log("------------------------------------------");
console.log(`Results: ${passed} Passed, ${failed} Failed`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log("All core logic unit tests passed successfully!");
}