# Virtuální nástěnka pro podporu výuky na 1. stupni základních škol

## Demo verze
Demo verzi naleznete na moji doméně [virtualni-nastenka.michalsmajzr.cz](https://virtualni-nastenka.michalsmajzr.cz/)

## Přihlašovací údaje učitele:
e-mail: ```teacher@virtualninastenka.online```  
heslo: ```root```

## Přihlašovací údaje předem vytvořených rodičů:
e-mail: ```petr.novak@gmail.com```  
heslo: ```root```

e-mail: ```novotny@centrum.cz```  
heslo: ```root```

e-mail: ```vesela@seznam.cz```  
heslo: ```root```

## Postup lokálního spuštění
1. Stáhněte repozitář *(bakalarska-prace, db.sql, docker-compose.yml, Dockerfile)*
2. Stáhněte a nainstalujte docker https://www.docker.com/products/docker-desktop/
3. V dockeru spusťte terminál a přejděte do aktuálního adresáře, kam jste stáhli *docker-compose.yml* (ujistěte se, že ve stejné složce je i soubor *db.sql*), zadejte příkaz:
```
docker-compose up --build -d
```
4. Na adrese http://localhost:3000/ nyní běží webová aplikace

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
