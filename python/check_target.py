#https://www.online-python.com/cVBjGF2Y5Z

hash = 0x706c7f21388b285414c4829ee3981398e0cac82e43e3
target = 0xcdf6f * 0x100 ** (0x17-0x3)
print(hex(hash)[2:].zfill(64))
print(hex(target)[2:].zfill(64))
print(target > hash)
