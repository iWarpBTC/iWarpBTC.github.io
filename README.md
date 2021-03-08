# Bitcoinový slovníček pro mírně pokročilé
**Bitcoin** – název decentralizované P2P sítě sloužící k uchování a přenosu hodnoty. Síť byla spustěna 3. ledna 2009,  když došlo k vytěžení prvního bloku. 
**bitcoin** – v síti přenášená jednotka hodnoty. Protokol stanoví maximální počet 21 milionů bitcoinů. 
**satoshi** – základní a zároveň nejmenší nejmenší možná jednotka používaná v sítí. 1 bitcoin = 100 000 000 satoshi. 
**blockchain** – speciální typ databáze, kde každý nový záznam navazuje (odkazuje) na ten předešlý.
**blok** – předepsaná datová struktura transakcí omezené velikosti (4 000 000 WU). Sestavá se s hlavičky bloku a serializovaných transakcí. 
**hlavička bloku** – sestává se z verze bloku, hashe předchozí bloku, hashe (rootu) merklovského stromu obsažených transakcí, času vytěžení, stanové obtížnosti sítě a nonce – variabilního čísla jehož změnou se dosahuje různých hashů. 
**hash (otisk, fingerprint)** – výstup jednosměrné matematické funkce, která libovolně dlouhá data převede číslo s daným rozsahem. Výstupem v Bitcoinu používané funkce SHA256 je 256 bitové číslo, zpravidla zapisované v šestnáctkové soustavě. Příklady:

| vstup | sha256(vstup) |
| ------ | ------ |
| Ahoj | f23e6807b3fb0be0ea999ea8cb88a3e94dc359c84230461f9761efac57dcb081 |
| Ahoy | 491312f2ce2f0d05cc8821956a34138428a72d6cbf3e426ef6bcc87f2905b614 |
| Ahoj, jak se dneska máš? | 56528a982b106e43d1f236360b6a72c4334918c0a83413d810ac0041f8f2e377 |

**těžení** – v podstatě se jedná o soutěž o právo zápisu dalšího bloku do blockchain. Soutěž vyhraje ten, kdo jako první sestaví takový navazující blok transakcí, jehož hash (resp. hash jeho hlavičky) bude menší, než nastavená obtížnost sítě. Nalezení takového hashe je věc náhody, šance se zvyšují se schopností otestovat co nejvíce variant v co nejmenším čase (ergo s početním výkonem).
**slova seedu** – počáteční entropie (zpravidla 128 až 256 bitové číslo) vyjádřená – z důvodů čitelnosti a odolnosti proti chybě při čtení/psaní – variací 12 až 24 slov z 2048 prvkového seznamu. Slova se mohou opakovat a odolnost pro chybě je zvýšena „kontrolní součtem“ (v posledním slově je zakodováno 4 až 8 bitů hashe počáteční entropie).
**seed (semínko)** – počáteční entropie (zpravidla 128 až 256 bitů) rozšířená funkcí PBKDF2 v 512 bitové číslo. Z tohoto čísla jsou následně deterministicky odvozovány všechny klíče (resp. adresy). Levých 256 bitů slouží jako master privátní klíč, pravých 256 bitů se použije jako master chain klíč. Často se slovem „seed“ zjednodušeně označují výše popsaná „slova seedu“.
**asymetrická kryptografie** – způsob šifrování kde je pro zašifrování zprávy použit jiný klíč, než jaký je použit k rozšifrování zprávy. Obráceným použitím klíčů (viz. níže) lze dosáhnout kryptografického podpisu. Bitcoin používá asymetrickou kryptografii eliptických křivek (konkrétně křivku popsanou standardem secp256k1 – y<sup>2</sup> = x<sup>3</sup> + 7).
**privátní klíč (private key)** – ten tajný z dvojce klíčů asymetrické kryptografie. Slouží k rozšifrování tajné zprávy, popř. k podpisu. V případě Bitcoinu se jedná o 256 bitové číslo.
**veřejný klíč (public key)** – druhý z páru. Slouží k zašifrování tajné zprávy, nebo k ověření podpisu. V případě Bitcoinu se jedná o bod na eliptické křivce, který je vypočten násobením stanoveného bodu (tzv. generátor cyklické grupy) a privátního klíče. Jelikož je bitcoinová eliptická křivka souměrná podle osy x, stačí k jeho reprezentaci souřadnice x (256 bitové číslo) a příznak sudosti. 
**bitcoinová adresa** -
