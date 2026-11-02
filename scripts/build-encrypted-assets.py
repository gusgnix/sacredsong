#!/usr/bin/env python3
"""Encrypt reader content for static hosting; never writes the password or key."""
import argparse,base64,getpass,hashlib,json,secrets
from pathlib import Path
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
parser=argparse.ArgumentParser()
parser.add_argument('--source-dir',required=True,help='Existing reader folder containing assets/book.json and assets/pages/*.webp')
parser.add_argument('--output-dir',default=str(Path(__file__).resolve().parents[1]))
args=parser.parse_args();source=Path(args.source_dir);target=Path(args.output_dir)
password=getpass.getpass('Reader encryption password (hidden): ')
salt=secrets.token_bytes(32);iterations=600000
key=hashlib.pbkdf2_hmac('sha256',password.encode(),salt,iterations,dklen=32);password=''
aes=AESGCM(key);used=set();total=0
metadata=json.loads((source/'assets/book.json').read_text())
def save(relative,data):
 global total
 nonce=secrets.token_bytes(12)
 while nonce in used:nonce=secrets.token_bytes(12)
 used.add(nonce);cipher=aes.encrypt(nonce,data,relative.encode())
 out=target/relative;out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(b'SAC1'+nonce+cipher)
 assert aes.decrypt(nonce,cipher,relative.encode())==data
 total+=len(data)
save('library/book.sac',(source/'assets/book.json').read_bytes())
for n in range(1,metadata['pages']+1):
 save(f'library/pages/{n:03}.sac',(source/'assets/pages'/f'{n:03}.webp').read_bytes())
config={'format':'SAC1','cipher':'AES-GCM','kdf':'PBKDF2-SHA256','iterations':iterations,'salt':base64.b64encode(salt).decode(),'manifest':'library/book.sac','pages':'library/pages/','version':'20261102-'+secrets.token_hex(4)}
(target/'reader-config.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n')
key=b''
print(f'Encrypted and round-trip verified {metadata["pages"]} pages plus book metadata; {total:,} plaintext bytes; no plaintext assets exported.')
