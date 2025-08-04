# Virtuální nástěnka pro podporu výuky na 1. stupni základních škol

## Postup spuštění
1. Stáhněte repozitář *(bakalarska-prace, db.sql, docker-compose.yml)*
2. Stáhněte a nainstalujte docker https://www.docker.com/products/docker-desktop/
3. V dockeru spusťte terminál a přejděte do aktuálního adresáře, kam jste stáhli *docker-compose.yml*, zadejte příkaz (ujistěte se, že ve stejné složce je i soubor *db.sql*):
```
docker-compose up --build
```
4. Na adrese http://localhost:8081/ nyní běží rozhraní pro správu databáze phpmyadmin, mysql beží na portu 3306 (porty lze upravit před buildem v *docker-compose.yml*), přihlašovací údaje k databázi jsou následující:
   
   jméno: ```root```  
   heslo: ```root```
   
5. Stáhněte a nainstalujte node.js server https://nodejs.org/en
6. Spusťe příkazový řádek jako správce a vstupte do staženého adresáře *bakalarska-prace*
7. V adresáři spusťe následující příkazy (vývojářskou verzi lze po příkazu ```npm install``` spustit příkazem  ```npm run dev```):
```
npm install
```
```
npm run build
```
```
npm run start
```

8. Na adrese http://localhost:3000/ nyní běží webová aplikace

## Přihlašovací údaje učitele:
e-mail: ```teacher@virtualninastenka.com```  
heslo: ```root```

## Přihlašovací údaje předem vytvořených rodičů:
e-mail: ```petr.novak@gmail.com```  
heslo: ```root```

e-mail: ```novotny@centrum.cz```  
heslo: ```root```

e-mail: ```vesela@seznam.cz```  
heslo: ```root```

## Odesílání e-mailu
Pro testování odesílání e-mailů při přidávání rodičů jsem zvolil službu Ethereal [https://ethereal.email/](https://ethereal.email/login)

přihlašovací jméno: ```abigale98@ethereal.email```  
heslo: ```ZYBgUPE2w8NzHNfbYK```

(Při vytvoření rodiče přijde e-mail s odkazem na přihlášení právě na tuto službu)  
</br>

> [!NOTE]
> Změnit údaje k odesílání e-mailu lze v souboru */bakalarska-prace/src/lib/mailer.ts*
> 
> Změnit údaje k připojení databázi lze v souboru: */bakalarska-prace/src/lib/db.ts*
> 
> Změnit údaje učitele lze v souboru: */bakalarska-prace/src/app/api/init/route.ts*
>
> Následně stačí ve webového prohlížeči načíst url a údaje se aktualizují: http://localhost:3000/api/init
> 
> Z bezpečnostních důvodů před nasazením smažte složku *init*
> 
> Před nasazením do produkční verze je nutné nastavit správné adresy v souboru */bakalarska-prace/.env*, v případě jiného než výchozího portu pro lokální server Next.js */bakalarska-prace/.env.local*
>

## EER diagram

<img width="816" height="998" alt="diagram" src="https://github.com/user-attachments/assets/dd0e2ab0-af01-48b5-87d8-08b15b0759d4" />

*Vygenerovaný pomocí služby MySQL Workbench.*
