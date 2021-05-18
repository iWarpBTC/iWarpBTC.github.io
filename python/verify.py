# https://www.online-python.com/0tu3dncIj2
from random import getrandbits
from hashlib import sha256

# charakteristika tělesa
char_telesa = 0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f
# řád grupy
rad_grupy = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141

# souřadnice generátoru
bodA_x = 0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798
bodA_y = 0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8

# sečtení bodu se sebou samým na křivce y^2 = x^3 + 7 
# https://en.wikipedia.org/wiki/Elliptic_curve_point_multiplication#Point_doubling
def point_doubling(x, y):
    delenec = (3 * pow(x, 2, char_telesa)) % char_telesa
    delitel = (2 * y) % char_telesa
    λ = (delenec * pow(delitel, char_telesa - 2, char_telesa)) % char_telesa # podíl
    ret_x = (pow(λ, 2, char_telesa) - (2 * x)) % char_telesa 
    ret_y = (λ * (x - ret_x) - y) % char_telesa
    return ret_x, ret_y
    
def point_add(x1, y1, x2, y2):
    if x1 == x2 and y1 == y2:
        return point_doubling(x1, y1)

    delenec = (y2 - y1) % char_telesa
    delitel = (x2 - x1) % char_telesa 
    λ = (delenec * pow(delitel, char_telesa - 2, char_telesa)) % char_telesa # podíl
    ret_x = (pow(λ, 2, char_telesa) - (x1 + x2)) % char_telesa 
    ret_y = (λ * (x1 - ret_x) - y1) % char_telesa
    return ret_x, ret_y

def point_multi(x, y, factor):
        f = factor
        r_x = r_y = 0
        c_x = x
        c_y = y
        while f:
            if f & 1:
                if r_x == 0:
                    r_x = c_x
                    r_y = c_y
                else:
                    r_x, r_y = point_add(r_x, r_y, c_x, c_y)
            c_x, c_y = point_doubling(c_x, c_y)
            f >>= 1
        return r_x, r_y
    
def double_sha256(s):
    return sha256(sha256(s).digest()).digest()

# ručně sestavený předobraz 
version = bytes.fromhex('01000000') 
prevs = bytes.fromhex('177b550c14d173e1ac3d9987b1c3892572c848381f7ef9d3dd29fbfac09e146101000000')
hashPrevs = double_sha256(prevs)
seq = bytes.fromhex('ffffffff')
hashSeq = double_sha256(seq)
outp = prevs 
code = bytes.fromhex('1976a914413879391419d23453c720a1058e959ae663c3d688ac')
ammount = bytes.fromhex('b3f8910000000000')
outs = bytes.fromhex('b1a6910000000000160014c3c03280e573ec2c59a8a11c2367368b514ff9d2204e000000000000160014e447450ba6baaf561ea6c3b9d1dc2cd687d961d2')
hashOuts = double_sha256(outs)
lock = bytes.fromhex('00000000')
hashtype = bytes.fromhex('01000000')

preimage = version + hashPrevs + hashSeq + outp + code + ammount + seq + hashOuts + lock + hashtype

hashPreimage = double_sha256(preimage)

# dekódovaný veřejný klíč s dopočítanou y souřadnicí (03c0fb6554508be65f82305cab41d97db37e2d5b3ba5920009209f9dfbcb00dbcc)
pubKey_x = 0xc0fb6554508be65f82305cab41d97db37e2d5b3ba5920009209f9dfbcb00dbcc
pubKey_y = 0xfaa47fc55cee16747b0027d187df20a701d75668c6896e73940d459c35647711

# dekódovaný podpis (304402201cbbe2ba007b80c6e23ff6c0069b7135580c4f00089474b4c882421408fde92502204e330225ae3a72364662f50a29c2d29db6b7063f71a721af7da905de30df312001)
r = 0x1cbbe2ba007b80c6e23ff6c0069b7135580c4f00089474b4c882421408fde925
s = 0x4e330225ae3a72364662f50a29c2d29db6b7063f71a721af7da905de30df3120

e = int.from_bytes(hashPreimage, 'big')

# ověření tx
u = e * pow(s, rad_grupy -2, rad_grupy) % rad_grupy
v = r * pow(s, rad_grupy -2, rad_grupy) % rad_grupy
bodU_x, bodU_y = point_multi(bodA_x, bodA_y, u)
bodV_x, bodV_y = point_multi(pubKey_x, pubKey_y, v)

bodX_x, bodX_y = point_add(bodU_x, bodU_y, bodV_x, bodV_y)
print('Podpis tx je: {}'.format(bodX_x == r))
