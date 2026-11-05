#!/usr/bin/env python3
"""Encrypt reader content for static hosting; never writes the password or key."""
import argparse,base64,getpass,hashlib,json,secrets
from pathlib import Path
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.exceptions import InvalidTag
parser=argparse.ArgumentParser()
parser.add_argument('--source-dir',required=True,help='Existing reader folder containing assets/book.json and assets/pages/*.webp')
parser.add_argument('--output-dir',default=str(Path(__file__).resolve().parents[1]))
parser.add_argument('--statistics-config',help='Private statistics JSON, required when rotating the password of a tracked book')
args=parser.parse_args();source=Path(args.source_dir);target=Path(args.output_dir)
password=getpass.getpass('Reader encryption password (hidden): ')
# Carry the private telemetry proof across book updates without exporting it.
proof=None
if args.statistics_config:
 proof=json.loads(Path(args.statistics_config).read_text())['proof']
elif (target/'reader-config.json').exists() and (target/'library/book.sac').exists():
 previous=json.loads((target/'reader-config.json').read_text())
 previous_key=hashlib.pbkdf2_hmac('sha256',password.encode(),base64.b64decode(previous['salt']),previous['iterations'],dklen=32)
 previous_bytes=(target/'library/book.sac').read_bytes()
 try:
  previous_book=json.loads(AESGCM(previous_key).decrypt(previous_bytes[4:16],previous_bytes[16:],b'library/book.sac'))
 except InvalidTag:
  raise SystemExit('Existing book password differs. Supply --statistics-config with the private server configuration when rotating the password.')
 proof=previous_book.get('unlockProof');previous_key=b''
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
if proof:metadata['unlockProof']=proof
save('library/book.sac',json.dumps(metadata,ensure_ascii=False,separators=(',',':')).encode())
for n in range(1,metadata['pages']+1):
 save(f'library/pages/{n:03}.sac',(source/'assets/pages'/f'{n:03}.webp').read_bytes())
config={'format':'SAC1','cipher':'AES-GCM','kdf':'PBKDF2-SHA256','iterations':iterations,'salt':base64.b64encode(salt).decode(),'manifest':'library/book.sac','pages':'library/pages/','version':'20261102-'+secrets.token_hex(4)}
(target/'reader-config.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n')
key=b''
print(f'Encrypted and round-trip verified {metadata["pages"]} pages plus book metadata; {total:,} plaintext bytes; no plaintext assets exported.')
