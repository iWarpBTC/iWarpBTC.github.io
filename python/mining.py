#https://www.online-python.com/91tBoPyQlX

from hashlib import sha256
from time import sleep

# hlavička
ver =  bytes.fromhex("20800000")
prev_block = bytes.fromhex("0000000000000000000b6d4bc8cc0eb8a0996e5bb56f6f106a1cb91dccc3db94")
merkle_root = bytes.fromhex("7dae23790d61194df5af6f872693b1b1d9e7f9f59f423f5d534921a3d1e7636b")
ts = bytes.fromhex("605cbc1e") 
bits = bytes.fromhex("170cdf6f")

# jaký je target?
exp = bits[0]
coef = int.from_bytes(bits[1:], 'big')
target = coef * 256 ** (exp-3)

print("--- Hlavička kandidátského bloku ", "-"*54)
print("verze: ".ljust(13), ver.hex())
print("prev blk: ".ljust(13), prev_block.hex())
print("merkle root: ", merkle_root.hex())
print("timestamp: ".ljust(13), ts.hex())
print("bits: ".ljust(13), bits.hex())
print("nonce: ".ljust(13), "????????")
print("-"*88)
print()
sleep(1)

nonce = 0xed0df04b - 5

# těžíme!
while nonce <= 0xffffffff:
    tx = ver[::-1] + prev_block[::-1] + merkle_root[::-1] + ts[::-1] + bits[::-1] + nonce.to_bytes(4, 'little')
    hash = sha256( sha256(tx).digest() ).digest()
    res = int.from_bytes(hash, "little") < target
    print("pro nonci {}: {} ; {}".format(hex(nonce)[2:], (hash[::-1]).hex(), "VYHOVUJE!" if res else "nevyhovuje"))
    if res:
        sleep(0.5)
        break
    else:
        nonce += 1
        sleep(1)

print("{}target byl: {}".format("".ljust(8) ,hex(target)[2:].zfill(64)))
print()
print("--- Hlavička bloku {}".format((hash[::-1]).hex()), "-"*4)
print("verze: ".ljust(13), ver.hex())
print("prev blk: ".ljust(13), prev_block.hex())
print("merkle root: ", merkle_root.hex())
print("timestamp: ".ljust(13), ts.hex())
print("bits: ".ljust(13), bits.hex())
print("nonce: ".ljust(13), nonce.to_bytes(4, 'big').hex())
print("-"*88)
