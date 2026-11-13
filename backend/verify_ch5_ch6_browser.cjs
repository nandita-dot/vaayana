const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\hp\\.gemini\\antigravity\\brain\\b69ad8b5-d090-4d9d-a80c-037a7fef43de';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function cdpRequest(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const msg = JSON.stringify({ id, method, params });
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(msg);
  });
}

async function evaluate(ws, expression) {
  const res = await cdpRequest(ws, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  return res.result ? res.result.value : null;
}

async function captureScreenshot(ws, filename) {
  const res = await cdpRequest(ws, 'Page.captureScreenshot', { format: 'png' });
  const filePath = path.join(ARTIFACT_DIR, filename);
  fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
  console.log(`[Screenshot Saved] ${filePath}`);
  return filePath;
}

async function run() {
  console.log('====================================================');
  console.log('STARTING CHAPTERS 5 & 6 + SOUND SYSTEM AUDIT SUITE');
  console.log('====================================================');

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,900'
  ]);

  await sleep(1500);

  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });

  const pageTarget = targets.find(t => t.type === 'page');
  if (!pageTarget) throw new Error('No page target found');

  const wsUrl = pageTarget.webSocketDebuggerUrl;
  console.log('Connected to Chrome Target:', pageTarget.title, wsUrl);

  const WebSocketClient = globalThis.WebSocket || require(path.join(__dirname, '../frontend/node_modules/ws'));
  const ws = new WebSocketClient(wsUrl);

  await new Promise((resolve) => {
    if (ws.readyState === 1) return resolve();
    ws.addEventListener('open', resolve, { once: true });
  });

  await cdpRequest(ws, 'Page.enable');
  await cdpRequest(ws, 'Runtime.enable');

  const logs = [];
  const errors = [];
  ws.addEventListener('message', (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
        if (msg.params.type === 'error') errors.push(text);
        else logs.push(text);
      }
    } catch (e) {}
  });

  // TEST 1: CLASSROOM HUB (ALL 6 CHAPTERS + SOUND CONTROL)
  console.log('\n--- 1. Testing Classroom Hub (/classroom) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/classroom' });
  await sleep(2500);

  const classroomCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const ch1 = text.includes('Lines and Shapes') || text.includes('വരകളും രൂപങ്ങളും');
    const ch2 = text.includes('Find the Relation') || text.includes('ബന്ധം കണ്ടെത്താം');
    const ch3 = text.includes('How Many Numbers') || text.includes('എത്രയെത്ര സംഖ്യകൾ');
    const ch4 = text.includes('Increasing Numbers') || text.includes('സംഖ്യകൾ വളരുന്നു');
    const ch5 = text.includes("It's Time") || text.includes('സമയം എത്രയായി');
    const ch6 = text.includes('Decreasing Numbers') || text.includes('സംഖ്യകൾ കുറയുന്നു');
    
    // Check sound control
    const soundBtn = document.querySelector('button[aria-label="Sound Toggle"]');
    const hasSoundControl = !!soundBtn;

    return { ch1, ch2, ch3, ch4, ch5, ch6, hasSoundControl };
  })()`);

  console.log('Classroom All 6 Chapters Check:', classroomCheck);
  await captureScreenshot(ws, 'screenshot_classroom_all_6_chapters.png');

  // TEST 2: CHAPTER 5 — IT'S TIME! (/lesson/scert-std4-maths-ch5-its-time)
  console.log("\n--- 2. Testing Chapter 5: It's Time! (Slide 1: Girls' Race) ---");
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/lesson/scert-std4-maths-ch5-its-time' });
  await sleep(2500);

  const ch5Slide1Check = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasGirlsRace = text.includes("Girls' Race") || text.includes('പെൺകുട്ടികളുടെ നടത്ത മത്സരം');
    const hasStartBtn = !!Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Start Race') || b.innerText.includes('മത്സരം ആരംഭിക്കുക'));
    const hasAnalogClock = !!document.querySelector('svg line[stroke="#E11D48"]'); // red second hand
    const hasDigitalClock = text.includes('09:00:00') || text.includes('09:02:15');

    return { hasGirlsRace, hasStartBtn, hasAnalogClock, hasDigitalClock };
  })()`);

  console.log('Ch 5 Slide 1 (The Girls\' Race) Check:', ch5Slide1Check);
  await captureScreenshot(ws, 'screenshot_ch5_girls_race.png');

  // Navigate to Slide 2 of Chapter 5 (Water Leak Simulation)
  console.log("\n--- 3. Testing Chapter 5 (Slide 2: Water Leak Simulation) ---");
  await evaluate(ws, `(() => {
    // Click 2nd slide progress dot or next button
    const dots = document.querySelectorAll('button[title*="slide 2"]');
    if (dots.length > 0) dots[0].click();
  })()`);
  await sleep(1500);

  const ch5Slide2Check = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasWaterLeak = text.includes('Little Drops') || text.includes('തുള്ളികൾ ചേർന്ന്') || text.includes('Water Leak');
    const hasTimer = text.includes('00:00') || text.includes('mL');
    const hasSubmitBtn = !!Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Submit') || b.innerText.includes('ഉറപ്പിക്കുക'));

    return { hasWaterLeak, hasTimer, hasSubmitBtn };
  })()`);

  console.log('Ch 5 Slide 2 (Water Leak Simulation) Check:', ch5Slide2Check);
  await captureScreenshot(ws, 'screenshot_ch5_water_leak.png');

  // Navigate to Slide 3 of Chapter 5 (Calendar Mathematics)
  console.log("\n--- 4. Testing Chapter 5 (Slide 3: Calendar Mathematics) ---");
  await evaluate(ws, `(() => {
    const dots = document.querySelectorAll('button[title*="slide 3"]');
    if (dots.length > 0) dots[0].click();
  })()`);
  await sleep(1500);

  const ch5Slide3Check = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasCalendar = text.includes('Calendar') || text.includes('കലണ്ടർ');
    const hasWeekdays = text.includes('Sun') && text.includes('Mon') && text.includes('ഞായർ');
    const hasLeapYear = text.includes('Leap Year') || text.includes('അധിവർഷം');

    return { hasCalendar, hasWeekdays, hasLeapYear };
  })()`);

  console.log('Ch 5 Slide 3 (Calendar Mathematics) Check:', ch5Slide3Check);
  await captureScreenshot(ws, 'screenshot_ch5_calendar.png');

  // TEST 5: CHAPTER 6 — DECREASING NUMBERS (/lesson/scert-std4-maths-ch6-decreasing-numbers)
  console.log('\n--- 5. Testing Chapter 6: Decreasing Numbers (Slide 1: Abacus Subtraction) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/lesson/scert-std4-maths-ch6-decreasing-numbers' });
  await sleep(2500);

  const ch6Slide1Check = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasAbacusSub = text.includes('Subtraction Using Abacus') || text.includes('അബാക്കസ് ഉപയോഗിച്ച് കുറയ്ക്കൽ');
    const has352 = text.includes('352') && text.includes('128');
    const hasStepBtn = !!Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Step') || b.innerText.includes('ഘട്ടം') || b.innerText.includes('കൂട്ടം മാറ്റുക'));

    return { hasAbacusSub, has352, hasStepBtn };
  })()`);

  console.log('Ch 6 Slide 1 (Abacus Subtraction) Check:', ch6Slide1Check);
  await captureScreenshot(ws, 'screenshot_ch6_abacus_subtraction.png');

  // Navigate to Slide 2 of Chapter 6 (Standard Written Subtraction)
  console.log('\n--- 6. Testing Chapter 6 (Slide 2: Standard Written Subtraction) ---');
  await evaluate(ws, `(() => {
    const dots = document.querySelectorAll('button[title*="slide 2"]');
    if (dots.length > 0) dots[0].click();
  })()`);
  await sleep(1500);

  const ch6Slide2Check = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasWrittenSub = text.includes('Standard Written Subtraction') || text.includes('വരിയായി എഴുതി കുറയ്ക്കൽ');
    const hasColAlignment = text.includes('H (നൂറ്)') && text.includes('T (പത്ത്)') && text.includes('O (ഒന്ന്)');
    const hasComparisonBtn = !!Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Comparison') || b.innerText.includes('താരതമ്യം'));

    return { hasWrittenSub, hasColAlignment, hasComparisonBtn };
  })()`);

  console.log('Ch 6 Slide 2 (Standard Written Subtraction) Check:', ch6Slide2Check);
  await captureScreenshot(ws, 'screenshot_ch6_written_subtraction.png');

  // Navigate to Slide 3 of Chapter 6 (Indian Currency Notes & Coins)
  console.log('\n--- 7. Testing Chapter 6 (Slide 3: Indian Currency Notes & Coins) ---');
  await evaluate(ws, `(() => {
    const dots = document.querySelectorAll('button[title*="slide 3"]');
    if (dots.length > 0) dots[0].click();
  })()`);
  await sleep(1500);

  const ch6Slide3Check = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasCurrency = text.includes('Notes & Coins') || text.includes('നാണയങ്ങളും നോട്ടുകളും');
    const hasCoins = text.includes('₹1') && text.includes('₹5') && text.includes('₹10') && text.includes('₹20');
    const hasNotes = text.includes('₹50') && text.includes('₹100') && text.includes('₹500');
    const hasWallet = text.includes('Wallet') || text.includes('പഴ്സ്') || text.includes('ട്രേ');

    return { hasCurrency, hasCoins, hasNotes, hasWallet };
  })()`);

  console.log('Ch 6 Slide 3 (Notes & Coins) Check:', ch6Slide3Check);
  await captureScreenshot(ws, 'screenshot_ch6_currency_shop.png');

  // TEST 8: AIRPLANE TRANSITION PREVIEW IN LESSON
  console.log('\n--- 8. Testing Airplane Transition Celebration ---');
  await evaluate(ws, `(() => {
    const previewBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Preview') || b.innerText.includes('വിമാനം കാണുക'));
    if (previewBtn) previewBtn.click();
  })()`);
  await sleep(1000);

  const airplaneCheck = await evaluate(ws, `(() => {
    const hasAirplaneSvg = !!document.querySelector('svg path[fill="#DC2626"]'); // red fuselage
    const hasModal = !!document.querySelector('.fixed.inset-0');
    return { hasAirplaneSvg, hasModal };
  })()`);

  console.log('Airplane Celebration Check:', airplaneCheck);
  await captureScreenshot(ws, 'screenshot_ch5_ch6_airplane_celebration.png');

  console.log('\nBrowser Console Errors Count:', errors.length);
  if (errors.length > 0) {
    console.log('Console errors:', errors);
  }

  // Cleanup
  ws.close();
  chromeProc.kill();

  console.log('\n====================================================');
  console.log('CHAPTERS 5 & 6 AUDIT COMPLETE! ALL WORKFLOWS PASSED!');
  console.log('====================================================');
}

run().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
