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
  console.log('STARTING MATHEMATICS-ONLY VERIFICATION SUITE');
  console.log('====================================================');

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,850'
  ]);

  await sleep(1500);

  // Get WebSocket debugger URL from Chrome
  const targets = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });

  const pageTarget = targets.find(t => t.type === 'page');
  if (!pageTarget) {
    throw new Error('No page target found');
  }

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

  // TEST 1: CLASSROOM HUB (http://127.0.0.1:5173/classroom)
  console.log('\n--- 1. Testing Classroom Hub (http://127.0.0.1:5173/classroom) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/classroom' });
  await sleep(2500);

  const classroomCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const hasMath = text.includes('Mathematics') || text.includes('ഗണിതം');
    const hasEVS = text.includes('Environmental Studies') || text.includes('പരിസരപഠനം');
    const hasEnglish = text.includes('English (ഇംഗ്ലീഷ്)') || text.includes('Wings of Life');
    
    // Check chapter cards
    const ch1 = text.includes('Lines and Shapes') || text.includes('വരകളും രൂപങ്ങളും');
    const ch2 = text.includes('Find the Relation') || text.includes('ബന്ധം കണ്ടെത്താം');
    const ch3 = text.includes('How Many Numbers') || text.includes('എത്രയെത്ര സംഖ്യകൾ');
    const ch4 = text.includes('Increasing Numbers') || text.includes('സംഖ്യകൾ വളരുന്നു');
    
    // Check subject selector buttons
    const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
    const subjectButtons = buttons.filter(b => b.includes('ഗണിതം') || b.includes('പരിസരപഠനം') || b.includes('ഇംഗ്ലീഷ്'));

    return {
      hasMath,
      hasEVS,
      hasEnglish,
      ch1,
      ch2,
      ch3,
      ch4,
      subjectButtons
    };
  })()`);

  console.log('Classroom Hub Check:', classroomCheck);
  await captureScreenshot(ws, 'screenshot_classroom_math_only.png');

  // TEST 2: TEACHER WORKSPACE (http://127.0.0.1:5173/teacher)
  console.log('\n--- 2. Testing Teacher Workspace (http://127.0.0.1:5173/teacher) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/teacher' });
  await sleep(2000);

  const teacherCheck = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const selects = Array.from(document.querySelectorAll('select')).map(s => {
      return Array.from(s.options).map(o => o.text);
    });
    const hasEVS = text.includes('Environmental Studies') || text.includes('പരിസരപഠനം');
    const hasEnglish = text.includes('English (ഇംഗ്ലീഷ്)');
    return {
      selectOptions: selects,
      hasEVS,
      hasEnglish
    };
  })()`);

  console.log('Teacher Workspace Check:', teacherCheck);
  await captureScreenshot(ws, 'screenshot_teacher_math_only.png');

  // TEST 3: LESSON VIEW CHAPTER 1 (http://127.0.0.1:5173/lesson/scert-std4-maths-ch1-lines-and-shapes)
  console.log('\n--- 3. Testing Lesson View Chapter 1 (Lines & Shapes) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/lesson/scert-std4-maths-ch1-lines-and-shapes' });
  await sleep(2500);

  const lesson1Check = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const titleMatch = text.includes('Lines and Shapes') || text.includes('വരകളും രൂപങ്ങളും');
    return {
      titleMatch,
      hasContent: text.length > 200
    };
  })()`);

  console.log('Lesson Chapter 1 Check:', lesson1Check);
  await captureScreenshot(ws, 'screenshot_lesson_ch1.png');

  // TEST 4: LESSON VIEW CHAPTER 3 (http://127.0.0.1:5173/lesson/scert-std4-maths-ch3-how-many-numbers)
  console.log('\n--- 4. Testing Lesson View Chapter 3 (Clock & Roman Numerals) ---');
  await cdpRequest(ws, 'Page.navigate', { url: 'http://127.0.0.1:5173/lesson/scert-std4-maths-ch3-how-many-numbers' });
  await sleep(2500);

  const lesson3Check = await evaluate(ws, `(() => {
    const text = document.body.innerText;
    const titleMatch = text.includes('How Many Numbers') || text.includes('എത്രയെത്ര സംഖ്യകൾ');
    return {
      titleMatch,
      hasContent: text.length > 200
    };
  })()`);

  console.log('Lesson Chapter 3 Check:', lesson3Check);
  await captureScreenshot(ws, 'screenshot_lesson_ch3.png');

  console.log('\nBrowser Console Errors Count:', errors.length);
  if (errors.length > 0) {
    console.log('Console errors:', errors.slice(0, 5));
  }

  // Cleanup
  ws.close();
  chromeProc.kill();

  console.log('\n====================================================');
  console.log('MATHEMATICS-ONLY BROWSER SUITE COMPLETE!');
  console.log('====================================================');
}

run().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
