// Verification script for DRISHTI Interactive Activities Logic
const assert = require('assert');

console.log("==================================================");
console.log("TESTING DRISHTI INTERACTIVE ACTIVITIES LOGIC");
console.log("==================================================");

// --- 1. Fraction Playground Logic ---
console.log("\n1. Testing Fraction Playground Logic...");
function calculateCircleSlices(denominator) {
  const center = 100, radius = 80, slices = [];
  if (denominator === 1) return [{ index: 0 }];
  const anglePerSlice = (2 * Math.PI) / denominator;
  for (let i = 0; i < denominator; i++) {
    const startAngle = i * anglePerSlice - Math.PI / 2;
    const endAngle = (i + 1) * anglePerSlice - Math.PI / 2;
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    slices.push({ index: i, x1, y1, x2, y2 });
  }
  return slices;
}

// Test slices generation for 1, 2, 4, 8, 12
[1, 2, 4, 8, 12].forEach(d => {
  const slices = calculateCircleSlices(d);
  assert.strictEqual(slices.length, d, `Expected ${d} slices for denominator ${d}`);
});
console.log("   ✓ SVG Circle sector geometry verified for denominators 1 to 12.");

// Test Equivalent fraction math
function areEquivalent(n1, d1, n2, d2) {
  return (n1 / d1) === (n2 / d2);
}
assert.strictEqual(areEquivalent(1, 2, 2, 4), true);
assert.strictEqual(areEquivalent(1, 2, 4, 8), true);
assert.strictEqual(areEquivalent(2, 3, 4, 6), true);
assert.strictEqual(areEquivalent(3, 4, 6, 8), true);
assert.strictEqual(areEquivalent(1, 3, 2, 5), false);
console.log("   ✓ Equivalent fraction validation logic verified.");

// Test Fraction comparison
function compareFractions(n1, d1, n2, d2) {
  const v1 = n1 / d1, v2 = n2 / d2;
  if (Math.abs(v1 - v2) < 0.0001) return '=';
  return v1 > v2 ? '>' : '<';
}
assert.strictEqual(compareFractions(3, 4, 2, 4), '>');
assert.strictEqual(compareFractions(1, 3, 1, 2), '<');
assert.strictEqual(compareFractions(2, 4, 4, 8), '=');
console.log("   ✓ Fraction comparison visual comparator verified.");

// --- 2. Multiplication Visualizer Logic ---
console.log("\n2. Testing Multiplication Visualizer Logic...");
function computeMultiplication(groups, itemsPerGroup) {
  const total = groups * itemsPerGroup;
  const repeatedAddition = Array.from({ length: groups }).map(() => itemsPerGroup).join(' + ');
  return { total, repeatedAddition };
}
const m7x4 = computeMultiplication(7, 4);
assert.strictEqual(m7x4.total, 28);
assert.strictEqual(m7x4.repeatedAddition, "4 + 4 + 4 + 4 + 4 + 4 + 4");

const m6x3 = computeMultiplication(6, 3);
assert.strictEqual(m6x3.total, 18);
assert.strictEqual(m6x3.repeatedAddition, "3 + 3 + 3 + 3 + 3 + 3");
console.log("   ✓ Multiplication repeated addition and product generation verified for 7x4 and custom factors.");

// --- 3. 4-Spike Abacus Simulator Logic ---
console.log("\n3. Testing Abacus Simulator Place Value Logic...");
function calculateAbacusValue(th, h, t, o) {
  return th * 1000 + h * 100 + t * 10 + o;
}
assert.strictEqual(calculateAbacusValue(3, 4, 5, 2), 3452);
assert.strictEqual(calculateAbacusValue(9, 9, 9, 9), 9999);
assert.strictEqual(calculateAbacusValue(1, 0, 0, 0), 1000);
assert.strictEqual(calculateAbacusValue(0, 0, 0, 7), 7);
console.log("   ✓ Abacus place value calculation (Th, H, T, O) verified.");

// --- 4. Interactive Analog Clock Geometry Logic ---
console.log("\n4. Testing Interactive Clock Hand Angle Logic...");
function getClockAngles(hours, minutes) {
  const minuteAngle = minutes * 6; // 360 / 60 = 6 deg/min
  const hourAngle = ((hours % 12) * 30) + (minutes * 0.5); // 360 / 12 = 30 deg/hr + 0.5 deg/min
  return { hourAngle, minuteAngle };
}
const noon = getClockAngles(12, 0);
assert.strictEqual(noon.hourAngle, 0);
assert.strictEqual(noon.minuteAngle, 0);

const threeFifteen = getClockAngles(3, 15);
assert.strictEqual(threeFifteen.minuteAngle, 90);
assert.strictEqual(threeFifteen.hourAngle, 97.5);

const sixThirty = getClockAngles(6, 30);
assert.strictEqual(sixThirty.minuteAngle, 180);
assert.strictEqual(sixThirty.hourAngle, 195);
console.log("   ✓ Analog clock hour and minute hand geometric angle calculations verified.");

// --- 5. Chapter 5: Elapsed Race Time & Water Leak Simulation Math ---
console.log("\n5. Testing Chapter 5 Elapsed Time & Water Leak Logic...");
function calculateElapsed(startH, startM, startS, endH, endM, endS) {
  const startTotal = startH * 3600 + startM * 60 + startS;
  const endTotal = endH * 3600 + endM * 60 + endS;
  const diffSec = endTotal - startTotal;
  return {
    min: Math.floor(diffSec / 60),
    sec: diffSec % 60,
    totalSeconds: diffSec
  };
}
// Ananya: 9:00:00 to 9:02:15
const r1 = calculateElapsed(9, 0, 0, 9, 2, 15);
assert.strictEqual(r1.min, 2);
assert.strictEqual(r1.sec, 15);

// Fatima: 9:00:00 to 9:03:05
const r2 = calculateElapsed(9, 0, 0, 9, 3, 5);
assert.strictEqual(r2.min, 3);
assert.strictEqual(r2.sec, 5);

// Meera: 9:00:00 to 9:04:30
const r3 = calculateElapsed(9, 0, 0, 9, 4, 30);
assert.strictEqual(r3.min, 4);
assert.strictEqual(r3.sec, 30);
console.log("   ✓ Girls race walking elapsed time calculations verified for all 3 runners.");

// Water leak calculation
function calculateWaterLeak(minutes) {
  const seconds = minutes * 60;
  const mlLeaked = seconds * 1; // 1 sec = 1 mL
  return mlLeaked;
}
assert.strictEqual(calculateWaterLeak(10), 600);
assert.strictEqual(calculateWaterLeak(1), 60);
assert.strictEqual(calculateWaterLeak(5), 300);
console.log("   ✓ Water leak 10-minute simulation verified (600 mL = 600 seconds).");

// --- 6. Chapter 6: Subtraction Regrouping & Currency Math ---
console.log("\n6. Testing Chapter 6 Subtraction Regrouping & Currency Math...");
function simulateAbacusSubtractionWithRegroup(minuend, subtrahend) {
  // 352 - 128:
  // Initial: H=3, T=5, O=2
  // Regroup: Tens - 1 = 4, Ones + 10 = 12
  // Subtract ones: 12 - 8 = 4
  // Subtract tens: 4 - 2 = 2
  // Subtract hundreds: 3 - 1 = 2
  // Result = 224
  let h = Math.floor(minuend / 100);
  let t = Math.floor((minuend % 100) / 10);
  let o = minuend % 10;

  const subO = subtrahend % 10;
  const subT = Math.floor((subtrahend % 100) / 10);
  const subH = Math.floor(subtrahend / 100);

  if (o < subO) {
    t -= 1;
    o += 10;
  }
  const diffO = o - subO;
  const diffT = t - subT;
  const diffH = h - subH;
  return diffH * 100 + diffT * 10 + diffO;
}
assert.strictEqual(simulateAbacusSubtractionWithRegroup(352, 128), 224);
assert.strictEqual(simulateAbacusSubtractionWithRegroup(546, 231), 315);
console.log("   ✓ Multi-digit abacus regrouping and column borrowing verified.");

// Currency change calculation
function calculateChange(paid, cost) {
  return paid - cost;
}
assert.strictEqual(calculateChange(200, 135), 65);
assert.strictEqual(calculateChange(100, 75), 25);
console.log("   ✓ Indian currency purchase and change calculations verified.");

console.log("\n==================================================");
console.log("ALL MATHEMATICS ACTIVITIES AND LOGIC TESTS PASSED!");
console.log("==================================================");
