// Topic assignment for glossary terms. Reviewed by hand — not derivable from the
// source HTML. Used by the term index ("Podle témat") and the per-entry label.
// The page itself keeps its original curated order; topics are metadata only.
export const TOPICS = [
  { id: 'zaklady', label: 'Základy' },
  { id: 'sit', label: 'Síť a blockchain' },
  { id: 'kryptografie', label: 'Kryptografie' },
  { id: 'penezenky', label: 'Peněženky a adresy' },
  { id: 'transakce', label: 'Transakce a poplatky' },
  { id: 'lightning', label: 'Lightning network' },
  { id: 'tezeni', label: 'Těžení' },
  { id: 'kultura', label: 'Lidé a kultura' },
];

export const TERM_TOPIC = {
  'capital-bitcoin': 'zaklady',
  bitcoin: 'zaklady',
  satoshi: 'zaklady',
  krypto: 'zaklady',

  p2p: 'sit',
  node: 'sit',
  timechain: 'sit',
  blockchain: 'sit',
  block: 'sit',
  'block-header': 'sit',
  genesis: 'sit',
  reorg: 'sit',
  sfork: 'sit',
  hfork: 'sit',
  segwit: 'sit',
  taproot: 'sit',

  hash: 'kryptografie',
  'asym-crypto': 'kryptografie',
  privkey: 'kryptografie',
  pubkey: 'kryptografie',

  wallet: 'penezenky',
  'hd-wallet': 'penezenky',
  'seed-words': 'penezenky',
  seed: 'penezenky',
  passphrase: 'penezenky',
  address: 'penezenky',

  transaction: 'transakce',
  script: 'transakce',
  utxo: 'transakce',
  utxo_join: 'transakce',
  fee: 'transakce',
  mempool: 'transakce',
  wu: 'transakce',
  vsize: 'transakce',
  rbf: 'transakce',
  cpfp: 'transakce',
  coinbase: 'transakce',

  ln: 'lightning',
  invoice: 'lightning',
  lnurl: 'lightning',
  lnaddress: 'lightning',
  htlc: 'lightning',

  mining: 'tezeni',
  target: 'tezeni',
  difficulty: 'tezeni',
  pow: 'tezeni',

  moscowtime: 'kultura',
  hodl: 'kultura',
  nakamoto: 'kultura',
};
