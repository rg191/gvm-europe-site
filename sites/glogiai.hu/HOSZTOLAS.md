# glogiai.hu – Hetzner hosztolás

> **Egy helyen minden, ami ehhez az oldalhoz tartozik.**  
> Ne keverd össze a `gvmeurope.hu` főoldallal vagy más projektekkel.

## Gyors referencia

| Mi | Hol |
|---|---|
| **Domain** | `glogiai.hu` |
| **Szerver IP** | `46.225.184.176` (Hetzner Cloud) |
| **Szerver útvonal** | `/srv/sites/glogiai.hu` |
| **Docker konténer** | `glogiai-hu-web` |
| **Belső port** | `9080` (127.0.0.1) |
| **Forráskód (GitHub)** | [rg191/gvm-europe-site](https://github.com/rg191/gvm-europe-site) → `sites/glogiai.hu/` |
| **Oldal szerkesztése** | `sites/glogiai.hu/public/index.html` |
| **Stílus** | `sites/glogiai.hu/public/static/style.css` |
| **DNS kezelő** | Tárhely.Eu (ns.tns1.eu – ns.tns4.eu) |

## Első telepítés (Hetzner szerveren)

```bash
ssh root@46.225.184.176

# Docker telepítése (ha még nincs)
# apt update && apt install -y docker.io docker-compose-plugin git rsync

mkdir -p /srv/sites/glogiai.hu
git clone https://github.com/rg191/gvm-europe-site.git /srv/sites/glogiai.hu/repo
cd /srv/sites/glogiai.hu/repo/sites/glogiai.hu
chmod +x deploy.sh
./deploy.sh
```

## Frissítés (javítás után)

```bash
ssh root@46.225.184.176
/srv/sites/glogiai.hu/deploy.sh
```

Vagy manuálisan:

```bash
cd /srv/sites/glogiai.hu
git -C repo pull
docker compose up -d --build
```

## Proxy beállítás (Coolify / Envoy)

A konténer a **9080-as porton** fut (csak localhost). A reverse proxy-nak ide kell mutatnia:

```
glogiai.hu  →  http://127.0.0.1:9080
www.glogiai.hu  →  http://127.0.0.1:9080
```

**Coolify-ban:** Új Static Site vagy Docker Compose service, domain: `glogiai.hu`, port: `9080`.

Ha jelenleg 404-et kapsz (`server: envoy`), a proxy nincs összekötve ezzel a konténerrel — ezt kell beállítani.

## DNS (Tárhely.Eu)

Az A rekordnak a Hetzner IP-re kell mutatnia (ez már így van):

```
glogiai.hu      A    46.225.184.176
www.glogiai.hu  A    46.225.184.176
```

## Helyi tesztelés

```bash
cd sites/glogiai.hu
docker compose up --build
# Böngésző: http://localhost:9080
```

## Mappa struktúra

```
sites/glogiai.hu/
├── HOSZTOLAS.md          ← ez a fájl
├── deploy.sh             ← szerver deploy script
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── .env.example
└── public/
    ├── index.html        ← oldal tartalma
    └── static/
        └── style.css     ← stílus
```

## Más site-ok (NE keverd!)

| Oldal | Hol van | Megjegyzés |
|---|---|---|
| **glogiai.hu** | Hetzner `/srv/sites/glogiai.hu` | Ez az oldal |
| **gvmeurope.hu** | Más szerver/IP (`185.80.49.249`) | Fő cégoldal |
| Netlify | Nem használt | Régi terv, nincs összekötve |
