import { Chess } from 'chess.js';
import Stockfish from 'stockfish';

const game = new Chess();
console.log('chess.js loaded. Starting position legal moves:', game.moves().length);

const engine = await Stockfish();
let resolved = false;
engine.onmessage = (line) => {
  const msg = typeof line === 'string' ? line : (line && line.data) || '';
  if (msg.startsWith('bestmove')) {
    console.log('\n✅ Stockfish computed a real move:', msg.split(' ')[1]);
    resolved = true;
    process.exit(0);
  }
};
engine.postMessage('uci');
engine.postMessage('position startpos');
engine.postMessage('go depth 12');

setTimeout(() => { if (!resolved) { console.log('TIMEOUT — no bestmove in 15s'); process.exit(1); } }, 15000);
