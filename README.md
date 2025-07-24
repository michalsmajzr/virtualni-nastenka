# virtualni-nastenka

Virtuální nástěnka pro podporu výuky na 1. stupni základních škol

Postup spuštění
1. stáhnout adresář /dev, db.sql, docker-compose.yml z repozitáře
2. stáhnout a nainstalovat docker [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
3. v docker otevřít terminál a spustit docker-compose.yml
4. na adrese http://localhost:8081/ nyní běží phpmyadmin pro správu mysql databáze
   přihlašovací údaje k databázi jsou následující:
     přihlašovací jméno: root
     heslo: root
5. po přihlášení do databáze je potřeba vytvořit databázi (položka v horním menu Databáze)
     název databáze: db
     kódování: utf8mb4_czech_ci
6. importovat přiložený soubor db.sql (položka v horním menu Import, Choose File, vlevo dole potvrdit)
7. stáhnout a nainstalovat node.js server [https://nodejs.org/en](https://nodejs.org/en)
8. spustit příkazový řádek a přejít do staženého adresáře dev
9. v adresáři spustit následující příkazy
  npm install
  npm run build
  npm run start (případně npm run dev pro spuštění developer módu)
11. na adrese http://localhost:3000/ nyní běží webová aplikace

Hotovo :)

Přihlašovací údaje učitele:
přihlašovací jméno: teacher@virtualninastenka.com
heslo: root

Přihlašovací údaje předem vytvořených rodičů:
přihlašovací jméno: petr.novak@gmail.com
heslo: root

přihlašovací jméno: novotny@centrum.cz
heslo: root

přihlašovací jméno: vesela@seznam.cz
heslo: root

Pro testování odesílání e-mailů při přidávání rodičů jsem zvolil službu Ethereal [https://ethereal.email/](https://ethereal.email/login)
  přihlašovací jméno: abigale98@ethereal.email
  heslo: ZYBgUPE2w8NzHNfbYK
  (Při vytvoření rodiče přijde e-mail s odkazem na přihlášení práve na tuto službu)
  Pro produkční verzi stačí změnit údaje v souboru /dev/src/lib/mailer.ts

Poznámky
Změnit údaje k připojení databázi lze v souboru: /dev/src/lib/db.ts

Změnit údaje učitele lze v souboru: /dev/src/app/api/init
Následně stačí načíst ve webového prohlížeče url a údaje se sami aktualizují: http://localhost:3000/api/init
Z bezpečnostních důvodů před nasazením produkční verze složku init smazat

Před nasazením do produkční verze je nutné nastavit správné adresy v soubor /dev/.env
