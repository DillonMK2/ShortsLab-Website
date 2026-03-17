#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Support both legacy (in-swarm) and shared (--swarm-dir) locations
const SCRIPT_DIR = __dirname;
let HM_ROOT = path.dirname(SCRIPT_DIR);

// Check for --swarm-dir argument (used when hm-mail is in shared location)
const swarmDirIndex = process.argv.indexOf('--swarm-dir');
if (swarmDirIndex !== -1 && process.argv[swarmDirIndex + 1]) {
  HM_ROOT = process.argv[swarmDirIndex + 1];
  // Remove --swarm-dir and its value from argv so other parsing works
  process.argv.splice(swarmDirIndex, 2);
}

const INBOX_DIR = path.join(HM_ROOT, 'inbox');
const NUDGE_DIR = path.join(HM_ROOT, 'nudges');
const AGENTS_FILE = path.join(HM_ROOT, 'agents.json');

function genId() {
  return Date.now().toString() + '-' + crypto.randomBytes(4).toString('hex');
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const current = argv[i];
    if (!current.startsWith('--')) continue;
    const key = current.slice(2);
    const value = argv[i + 1];
    if (value && !value.startsWith('--')) {
      args[key] = value;
      i += 1;
    } else {
      args[key] = 'true';
    }
  }
  return args;
}

function readAgents() {
  if (!fs.existsSync(AGENTS_FILE)) return [];
  try {
    const raw = fs.readFileSync(AGENTS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value) + '\n', 'utf8');
}

function sendCommand(argv) {
  const args = parseArgs(argv);
  const to = args.to || '';
  const body = args.body || '';
  const msgType = args.type || 'message';

  if (!to || !body) {
    console.error('Usage: hm-mail send --to <agent|@all|@operator> [--type message|status|escalation|worker_done] --body "message"');
    process.exit(1);
  }

  const msgId = genId();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const from = process.env.HIVEMYND_AGENT_NAME || 'unknown';
  const payloadTo = to === '@all' ? '@all' : to;

  const sendTo = (target) => {
    const targetInbox = path.join(INBOX_DIR, target);
    fs.mkdirSync(targetInbox, { recursive: true });
    fs.mkdirSync(NUDGE_DIR, { recursive: true });
    writeJson(path.join(targetInbox, msgId + '.json'), {
      id: msgId, from, to: payloadTo, body, type: msgType, timestamp,
    });
    fs.writeFileSync(path.join(NUDGE_DIR, target + '.txt'),
      'Message from ' + from + '\n', 'utf8');
  };

  if (to === '@all') {
    for (const agent of readAgents()) {
      if (agent && typeof agent.label === 'string') sendTo(agent.label);
    }
  } else {
    sendTo(to);
  }
  console.log('Sent to ' + to);
}

function checkCommand(argv) {
  const inject = argv.includes('--inject');
  const agentName = process.env.HIVEMYND_AGENT_NAME || '';

  if (!agentName) { console.error('HIVEMYND_AGENT_NAME not set'); process.exit(1); }

  const agentInbox = path.join(INBOX_DIR, agentName);
  if (!fs.existsSync(agentInbox) || !fs.statSync(agentInbox).isDirectory()) {
    process.exit(0);
  }

  const messageFiles = fs.readdirSync(agentInbox)
    .filter(f => f.endsWith('.json')).sort();

  if (inject) console.log('\n--- HiveMynd Inbox ---');

  for (const fileName of messageFiles) {
    const fullPath = path.join(agentInbox, fileName);
    try {
      const message = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      const from = typeof message.from === 'string' ? message.from : 'unknown';
      const body = typeof message.body === 'string' ? message.body : '';
      const type = typeof message.type === 'string' ? message.type : 'message';
      const timestamp = typeof message.timestamp === 'string' ? message.timestamp : '';
      if (inject) {
        console.log('From: ' + from + ' | Type: ' + type + ' | Time: ' + timestamp);
        console.log(body);
        console.log('');
        fs.rmSync(fullPath, { force: true });
      } else {
        console.log('From: ' + from + ' | Type: ' + type);
        console.log(body);
        console.log('');
      }
    } catch { if (inject) fs.rmSync(fullPath, { force: true }); }
  }

  if (inject) console.log('--- End Inbox ---');
}

function agentsCommand() {
  if (!fs.existsSync(AGENTS_FILE)) { console.error('No agents'); process.exit(1); }
  process.stdout.write(fs.readFileSync(AGENTS_FILE, 'utf8'));
}

const command = process.argv[2] || '';
const argv = process.argv.slice(3);
switch (command) {
  case 'send': sendCommand(argv); break;
  case 'check': checkCommand(argv); break;
  case 'agents': agentsCommand(); break;
  default:
    console.error("hm-mail: unknown command '" + command + "'");
    process.exit(1);
}
