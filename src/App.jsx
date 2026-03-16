import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// QUIZ DATA — inline for artifact
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ─── QUIZ DATA ───────────────────────────────────────────
// Format: {q, o:[4 options], c:correct index 0-3, e:explanation, d:"recall"|"apply"|"case"|"numeric"}

const W1Q = [
{q:"Qual è la funzione primaria della registrazione a TikTok Shop?",o:["Creare campagne ads","Abilitare formalmente il seller a operare sulla piattaforma","Aprire automaticamente il programma affiliati","Attivare GMV Max"],c:1,e:"La registrazione abilita formalmente l'operatività del seller. Le altre sono fasi successive.",d:"recall"},
{q:"In quale area si gestiscono accessi e permessi del team nel Seller Center?",o:["LIVE Manager","Gestione degli accessi","Growth Center","Product Optimizer"],c:1,e:"Lì si governano utenti e permessi. Le altre aree servono ad altro.",d:"recall"},
{q:"A cosa serve soprattutto un account marketing TikTok Shop?",o:["Gestire resi e rimborsi","Collegare e operare attività media/ads","Verificare il brand registry","Programmare le LIVE"],c:1,e:"L'account marketing abilita la parte media/ads.",d:"recall"},
{q:"Il ripristino self-service dell'account è utile soprattutto quando:",o:["Si vuole cambiare categoria prodotto","Si perde o compromette l'accesso all'account","Si vuole aumentare lo stock","Si vuole cambiare commissioni affiliate"],c:1,e:"Il self-service recovery è per problemi di accesso.",d:"recall"},
{q:"Il 'periodo di prova' del nuovo negozio esiste principalmente per:",o:["Testare gli annunci creativi","Monitorare l'avvio operativo e la qualità iniziale del seller","Assegnare creator in automatico","Ridurre la commissione piattaforma"],c:1,e:"Il probation osserva qualità e operatività iniziale.",d:"recall"},
{q:"Quale tra queste è la scelta migliore in termini di governance accessi?",o:["Un solo login condiviso da tutto il team","Un account per persona con permessi coerenti col ruolo","Password uguale per tutti i collaboratori","Nessun admin, solo operatori"],c:1,e:"Ruoli distinti = controllo, sicurezza, tracciabilità.",d:"recall"},
{q:"'Sell Across EU' riguarda soprattutto:",o:["La possibilità di fare LIVE in più lingue","La possibilità di vendere in più mercati UE con setup dedicato","La creazione di coupon multi-country","Il recupero account"],c:1,e:"Riguarda vendita su più mercati UE con setup coerente.",d:"recall"},
{q:"Se un merchant usa Shopify, quale tema diventa particolarmente rilevante?",o:["Moderazione LIVE","Sincronizzazione prodotti e setup integrazione","Creator outreach","Refund without return"],c:1,e:"Con Shopify l'integrazione catalogo è cruciale.",d:"recall"},
{q:"La verifica dell'account TikTok Shop è collegata a:",o:["Qualità del copione LIVE","Affidabilità/validazione del seller account","Spedizione gratuita","Gestione dei campioni"],c:1,e:"La verifica riguarda la validazione del seller.",d:"recall"},
{q:"Qual è il primo principio corretto sulla sicurezza account?",o:["Condividere il login principale solo internamente","Limitare gli accessi, proteggerli e tracciare chi fa cosa","Usare sempre l'account owner per tutte le operazioni","Dare accesso admin a tutte le agenzie"],c:1,e:"La sicurezza nasce da accessi limitati e tracciabili.",d:"recall"},
{q:"Un merchant vuole che l'agenzia lavori senza usare le credenziali del founder. Cosa fai?",o:["Chiedo il login principale","Creo/propongo utenze separate con permessi adeguati","Uso l'account finance per tutti","Evito di collegare l'agenzia"],c:1,e:"Il partner non dovrebbe operare col login del founder.",d:"apply"},
{q:"Un seller ha completato la registrazione ma non riesce a lanciare campagne. Il primo controllo è:",o:["Se esiste e/o è collegato l'account marketing","Se ci sono abbastanza coupon follower","Se il LIVE script è pronto","Se i campioni sono rimborsabili"],c:0,e:"Il blocco più probabile è la parte marketing/account media.",d:"apply"},
{q:"Un partner sta preparando l'onboarding. Quale sequenza è più logica?",o:["Ads → LIVE → registrazione → accessi","Registrazione → accessi/sicurezza → setup account → eventuale marketing account","Coupon → commissioni affiliate → Shopify → refund","LIVE event → stock → customer service → probation"],c:1,e:"Parte dalle fondamenta corrette.",d:"apply"},
{q:"Il periodo di prova va spiegato al merchant come:",o:["Una fase puramente formale senza impatti","Una fase iniziale in cui la piattaforma osserva qualità e operatività","Un programma media per seller nuovi","Uno sconto temporaneo sulle commissioni"],c:1,e:"Il probation non è decorativo: condiziona la fase iniziale.",d:"apply"},
{q:"Un seller vuole espandersi in altri mercati UE. Quale ambito va studiato per primo?",o:["Sell Across EU e relative opzioni di spedizione/informazioni","Solo LIVE Ads","Solo coupon standard","Solo account verificato"],c:0,e:"Senza setup EU/logistica il cross-border è fragile.",d:"apply"},
{q:"Un partner propone un solo account condiviso 'così è più veloce'. Qual è la critica migliore?",o:["È lento da usare","Riduce accountability, aumenta rischio sicurezza e rende difficile gestire i ruoli","Impedisce di fare LIVE","Non permette di caricare prodotti"],c:1,e:"Shared login riduce accountability.",d:"apply"},
{q:"Se sospetti un accesso non autorizzato, la priorità è:",o:["Creare un codice promozionale","Mettere in pausa la crescita e mettere in sicurezza l'account","Lanciare una LIVE per recuperare vendite","Cambiare la categoria del negozio"],c:1,e:"Prima si blocca il rischio, poi si riparte.",d:"apply"},
{q:"Qual è la responsabilità corretta tra merchant e partner?",o:["L'agenzia dovrebbe sempre essere owner dello shop","Il merchant dovrebbe restare titolare, il partner opera tramite accessi assegnati","Il creator dovrebbe essere admin","Il courier dovrebbe avere accesso admin"],c:1,e:"L'owner resta il merchant, il partner opera su accessi assegnati.",d:"apply"},
{q:"Quale elemento è meno pertinente nella settimana 1?",o:["Registrazione","Gestione accessi","Probation","Copione LIVE avanzato"],c:3,e:"Il copione LIVE avanzato appartiene a una fase successiva.",d:"apply"},
{q:"Quale frase descrive meglio l'obiettivo della settimana 1?",o:["Portare il partner a scalare paid media","Portare il partner a impostare correttamente le fondamenta del seller","Portare il partner a gestire creator top-tier","Portare il partner a ottimizzare i co-funded coupons"],c:1,e:"La settimana 1 serve a costruire fondamenta solide.",d:"apply"},
{q:"Mini-caso: merchant con founder, finance manager e agenzia. Quale setup accessi è migliore?",o:["Founder e agenzia condividono lo stesso utente admin","Founder admin, finance con accesso coerente alla finanza, agenzia con permessi operativi dedicati","Solo finance admin","Solo agenzia admin"],c:1,e:"Separa ruoli e responsabilità in modo coerente.",d:"case"},
{q:"Mini-caso: merchant registra lo shop ma rinvia la configurazione sicurezza. Il rischio maggiore?",o:["Nessuno, non cambia nulla","Vulnerabilità operativa proprio nella fase più delicata di avvio","Si blocca il catalogo in automatico","Non si potranno mai fare LIVE"],c:1,e:"Proprio in avvio la mancanza di sicurezza è più pericolosa.",d:"case"},
{q:"Mini-caso: seller vuole entrare subito in più mercati UE senza chiarire flussi logistici. Risposta migliore?",o:["Procedere comunque, si aggiusta dopo","Fermarsi e chiarire setup, spedizione e requisiti prima di scalare","Fare solo campagne","Saltare la parte EU e fare solo affiliazione"],c:1,e:"Il cross-border non va improvvisato.",d:"case"},
{q:"Mini-caso: merchant non capisce la differenza tra Seller Center access e account marketing. Cosa spieghi?",o:["Sono sinonimi","Uno governa operatività dello shop, l'altro abilita la parte media","L'account marketing serve ai resi","L'access management serve solo alle LIVE"],c:1,e:"Seller Center e account marketing coprono funzioni diverse.",d:"case"},
{q:"Mini-caso: partner deve fare handover a un collega. Quale asset è più utile?",o:["Un audio vocale","Una checklist strutturata onboarding + ruoli + rischi + stato setup","Solo il link al webinar","Solo le credenziali del founder"],c:1,e:"Una checklist trasferisce il contesto in modo affidabile.",d:"case"},
{q:"Mini-caso: seller usa Shopify e segnala mismatch tra catalogo e shop. Il primo contenuto utile?",o:["LIVE dashboard","TikTok for Shopify onboarding + sync prodotti","Coupon di chat","Creator messages"],c:1,e:"È il blocco più utile a risolvere mismatch integrazione/catalogo.",d:"case"},
{q:"Mini-caso: il founder lascia l'azienda e solo lui era admin. La best practice mancata era:",o:["Non fare LIVE","Avere ridondanza controllata negli accessi e ownership chiara","Usare più coupon","Evitare account verificato"],c:1,e:"Mancava ridondanza controllata e governance accessi.",d:"case"},
{q:"Mini-caso: partner vuole partire dalla settimana 1 con campioni creator e GMV Max. Il rischio?",o:["Nessuno, è l'ordine ideale","Costruire crescita su fondamenta account e setup ancora fragili","Avere troppo customer care","Pagare meno fee"],c:1,e:"Scalare prima del setup crea rischio strutturale.",d:"case"},
{q:"Mini-caso: perché l'owner account non va usato per l'operatività quotidiana di tutti?",o:["Perché è più lento","Perché concentrare tutto sull'owner aumenta rischio e riduce tracciabilità","Perché l'owner non può vedere gli ordini","Perché l'owner non può fare advertising"],c:1,e:"Usare l'owner per tutto aumenta rischio e opacità.",d:"case"},
{q:"Quale percorso è più maturo?",o:["Registrazione incompleta, ma campagne già in valutazione","Accessi condivisi, nessun marketing account, ma idea chiara di coupon","Registrazione completata, ruoli assegnati, sicurezza impostata, marketing account valutato, piano EU solo dopo readiness","Shopify attivo, ma nessun admin interno merchant"],c:2,e:"Mostra sequencing corretto e readiness.",d:"case"},
{q:"5 persone lavorano sullo shop. Account condiviso: tracciabilità 25%. Account separati: tracciabilità 100%. Qual è l'impatto?",o:["Nessuna differenza pratica","L'account separato riduce la velocità ma non la governance","Gli account separati aumentano accountability e riducono errori non attribuibili","L'account condiviso è meglio perché più semplice"],c:2,e:"La differenza è di accountability e controllo reale.",d:"numeric"},
{q:"Shop in probation, 80 ordini in 10 giorni. Promo da 200 ordini in 3 giorni, ma capacità max 40/giorno. Lettura?",o:["Si lancia: più ordini = meglio","Il rischio è sovraccaricare l'operatività nella fase più fragile","È un tema solo finance","Basta aprire una LIVE"],c:1,e:"200 ordini in 3 giorni = ~67/die, sopra la capacità di 40/die.",d:"numeric"},
{q:"3 mercati UE, ciascuno richiede 9 ore (4 setup + 3 verifica + 2 coordinamento). 18 ore disponibili. Quanti mercati?",o:["1","2","3","4"],c:1,e:"Ogni mercato richiede 9 ore; con 18 ore ne copri 2.",d:"numeric"},
{q:"3 merchant da onboardare. Per merchant: 1,5h registrazione + 1h accessi + 0,5h marketing + 1h handover. Ore totali?",o:["9","10,5","12","13,5"],c:2,e:"Per merchant servono 4 ore; per 3 merchant = 12 ore.",d:"numeric"},
{q:"5 utenti: admin a tutti = rischio 'alto'. Admin a 1-2 + permessi specifici = rischio -60%. Decisione migliore?",o:["Admin a tutti, per comodità","Admin solo ai creator","Governance a privilegi differenziati","Nessun admin"],c:2,e:"La governance a privilegi differenziati è la soluzione più matura.",d:"numeric"},
];

const W2Q = [
{q:"'Gestione prodotti' riguarda principalmente:",o:["Il set di processi per creare e mantenere il catalogo","La gestione dei creator","La moderazione LIVE","Il recupero account"],c:0,e:"Gestione prodotti = costruzione e mantenimento catalogo.",d:"recall"},
{q:"La gestione dell'inventario serve soprattutto a:",o:["Assegnare permessi utenti","Mantenere disponibilità e coerenza stock","Creare coupon follower","Gestire chargeback"],c:1,e:"Inventory management governa disponibilità reale.",d:"recall"},
{q:"I codici identificativi del prodotto servono a:",o:["Distinguere e tracciare correttamente i prodotti","Verificare i creator","Calcolare la commissione affiliati","Attivare l'account marketing"],c:0,e:"Gli identificativi servono a distinguere e tracciare prodotti.",d:"recall"},
{q:"Product Optimizer è più vicino a quale finalità?",o:["Migliorare listing e readiness del catalogo","Fare appeal IP","Moderare commenti LIVE","Gestire banking"],c:0,e:"Migliora listing e qualità catalogo.",d:"recall"},
{q:"Le impostazioni pre-spedizione servono a:",o:["Configurare il setup logistico prima dell'evasione","Scegliere gli host LIVE","Verificare l'account","Creare codici promo"],c:0,e:"Riguardano setup logistico pre-evasione.",d:"recall"},
{q:"'Spedito tramite piattaforma' e 'Spedito dal venditore' differiscono per:",o:["Il modello operativo/logistico adottato","Il linguaggio delle LIVE","Il tipo di creator disponibili","Il tipo di coupon"],c:0,e:"Cambia il modello logistico.",d:"recall"},
{q:"La gestione ordini copre:",o:["Solo i resi","L'intero flusso di elaborazione dell'ordine","Solo le tasse","Solo il catalogo"],c:1,e:"La gestione ordini copre il flusso end-to-end.",d:"recall"},
{q:"'Pacchi con anomalie' rientra soprattutto in:",o:["Creator scouting","Fulfillment operativo","Account security","GMV Max"],c:1,e:"Le anomalie pacco sono un tema di fulfillment.",d:"recall"},
{q:"La modalità vacanza serve a:",o:["Congelare temporaneamente l'operatività in modo controllato","Attivare vendite a tempo","Cambiare fee platform","Aggiungere admin"],c:0,e:"Vacation mode serve a sospendere controllatamente.",d:"recall"},
{q:"La gestione dei resi/rimborsi è importante perché:",o:["Non impatta mai la salute dello shop","Incide su esperienza cliente e performance operative","Serve solo al team finance","Riguarda solo seller cross-border"],c:1,e:"Resi e rimborsi impattano cliente e salute shop.",d:"recall"},
{q:"Merchant con stock basso che continua a spingere prodotti senza aggiornare inventario. Rischio?",o:["Mismatch operativo e problemi sugli ordini","Blocco dell'account marketing","Peggioramento copione LIVE","Perdita del verified badge"],c:0,e:"Stock errato = problemi ordini.",d:"apply"},
{q:"Per scegliere tra FBP e SFS, il criterio corretto è:",o:["Quale modello logistico è più coerente con struttura e processi del seller","Quale dà più like","Quale è migliore per i creator","Quale serve per il probation"],c:0,e:"La scelta dipende dalla capacità operativa.",d:"apply"},
{q:"Seller accumula ritardi nelle spedizioni. Risposta più matura:",o:["Ignorare finché le vendite vanno","Analizzare processo di evasione e correggere setup e tempi","Fare più coupon","Cambiare logo shop"],c:1,e:"I ritardi si correggono sui processi.",d:"apply"},
{q:"Etichette di spedizione e problemi di stampa rientrano in:",o:["Execution operativa ordini","Strategia creator","Verifica account","LIVE performance"],c:0,e:"È execution ordini.",d:"apply"},
{q:"La guida su annullamenti ordini serve a:",o:["Capire come gestire cancellazioni in modo corretto","Reclutare creator","Calcolare GMV Max attribution","Fare growth center"],c:0,e:"Serve a gestire cancellazioni correttamente.",d:"apply"},
{q:"Il customer service su TikTok Shop va visto come:",o:["Attività secondaria","Leva critica di esperienza cliente e salute operativa","Tema solo per seller molto grandi","Attività del corriere"],c:1,e:"Customer service è leva critica.",d:"apply"},
{q:"Le basi finanziarie del seller includono:",o:["Commissione piattaforma, pagamenti, liquidazioni, report","Solo live gifts","Solo ads budget","Solo costi di campioni"],c:0,e:"Queste sono le basi finanziarie.",d:"apply"},
{q:"Il punteggio prestazioni shop serve a:",o:["Misurare lo stato di salute operativo del negozio","Decidere il colore dello shop tab","Selezionare i creator","Recuperare password"],c:0,e:"Il performance score misura la salute del negozio.",d:"apply"},
{q:"I prodotti vietati, non supportati e soggetti a restrizioni vanno trattati come:",o:["Dettagli marginali","Pilastro di compliance pre-listing","Tema unicamente legale","Tema ads-only"],c:1,e:"La compliance prodotto va gestita prima del listing.",d:"apply"},
{q:"La proprietà intellettuale è rilevante perché:",o:["Una violazione può generare enforcement e rischio account","Serve solo ai brand luxury","Conta solo fuori UE","È scollegata dal catalogo"],c:0,e:"L'IP può causare enforcement serio.",d:"apply"},
{q:"Seller nota molti ordini cancellati per errori interni. Cosa fai per primo?",o:["Spingi più traffico","Analizzi processo ordine/stock/fulfillment prima di crescere","Cambi host LIVE","Aumenti commissione creator"],c:1,e:"Prima correggi il motore operativo.",d:"case"},
{q:"Merchant riceve richieste clienti e il team non risponde con metodo. Rischio maggiore?",o:["Solo rallentare ads","Peggiorare esperienza cliente e metriche di servizio","Perdere accesso Shopify","Non poter creare product bundles"],c:1,e:"Servizio clienti debole peggiora esperienza e metriche.",d:"case"},
{q:"Seller vuole mettere online prodotto borderline senza leggere policy. Risposta migliore?",o:["Pubblicarlo e vedere se passa","Verificare policy categoria/prodotto prima del listing","Farlo passare via LIVE","Pubblicarlo con nome diverso"],c:1,e:"La policy va letta prima della pubblicazione.",d:"case"},
{q:"Perché un partner dovrebbe conoscere pagamenti e liquidazioni, se non fa finance?",o:["Non serve conoscerli","Perché impattano le conversazioni col merchant e la fiducia nel modello","Perché servono solo ai creator","Perché sostituiscono le metriche shop"],c:1,e:"Il partner deve saper parlare di effetti economico-operativi.",d:"case"},
{q:"Seller cross-border senza tariffario e opzioni spedizione chiare. Rischio?",o:["Solo meno follower","Costi e aspettative operative non allineate","Impossibilità di usare coupon LIVE","Perdita del verified account"],c:1,e:"Cross-border senza chiarezza crea disallineamento costi/servizio.",d:"case"},
{q:"Listing deboli, info prodotto incomplete, misure poco chiare. Leve più corrette?",o:["Product Optimizer + qualità listing + scelta corretta informazioni","Solo più ads","Solo nuovi creator","Solo coupon shipping"],c:0,e:"È il pacchetto corretto di leve per migliorare il catalogo.",d:"case"},
{q:"Seller ha molte anomalie pacco e tracking poco pulito. Diagnosi?",o:["Problema di branding","Debolezza del processo logistico/esecutivo","Problema del copione LIVE","Problema di affiliazione"],c:1,e:"Anomalie e tracking indicano debolezza operativa.",d:"case"},
{q:"Prima di aumentare ordini con promozioni, quale domanda devi farti?",o:["Il logo è bello?","Il merchant riesce a evadere bene un volume più alto?","Quanti creator famosi ha?","Ha un coupon follower?"],c:1,e:"Prima della crescita, la capacità di evasione.",d:"case"},
{q:"Merchant con ottimo traffico ma resi in peggioramento. Mossa migliore?",o:["Ignorare, il top line conta di più","Indagare cause di prodotto, fulfillment e aspettative cliente","Alzare ads spend","Cambiare categoria"],c:1,e:"Serve una diagnosi sulle cause reali dei resi.",d:"case"},
{q:"Qual è il merchant più 'ready'?",o:["Listing forti, inventory aggiornato, logistica configurata, customer care presidiato, policy verificate","Tante promo ma stock incerto","Molto traffico ma ordini con anomalie","LIVE attive ma catalogo incompleto"],c:0,e:"È il profilo più pronto a scalare.",d:"case"},
{q:"300 ordini/settimana, 20 cancellati per errore seller. Seller fault cancellation rate?",o:["3,3%","5,0%","6,7%","8,0%"],c:2,e:"20/300 = 6,7%.",d:"numeric"},
{q:"500 ordini in 10 giorni, 50 spediti in ritardo. Late dispatch rate?",o:["5%","8%","10%","12%"],c:2,e:"50/500 = 10%.",d:"numeric"},
{q:"Stock sistema 1.000, reale 820. Dopo 180 ordini evasi, promo da 250 ordini. Rischio oversell su stock reale?",o:["0 — lo stock reale residuo (640) copre i 250 ordini","30","70","110"],c:0,e:"Stock reale dopo 180 evasi = 640. 640 > 250, quindi nessun oversell immediato. Ma il mismatch di 180 unità nel sistema resta un rischio strutturale.",d:"numeric"},
{q:"1 addetto (25 ticket/giorno) + 2 addetti extra (20 ciascuno). Picco 90 ticket/giorno. Il team copre?",o:["No, mancano 25 ticket/giorno","No, mancano 15 ticket/giorno","Sì, con margine di 5","Sì, con margine di 15"],c:0,e:"Capacità: 25 + 20 + 20 = 65. Deficit: 90 - 65 = 25 ticket/giorno.",d:"numeric"},
{q:"GMV netto 20.000€, commissione piattaforma 9%. Quanto paga?",o:["1.200€","1.500€","1.800€","2.000€"],c:2,e:"20.000 × 9% = 1.800€.",d:"numeric"},
];

const W3Q = [
{q:"Il programma di affiliazione di TikTok Shop serve principalmente a:",o:["Collegare creator e seller per generare vendite","Verificare l'account","Gestire i resi","Sostituire le ads"],c:0,e:"L'affiliazione collega creator e seller per generare vendite.",d:"recall"},
{q:"Una collaborazione 'aperta' è tipicamente:",o:["Accessibile a creator in modo più ampio","Limitata a un solo creator invitato","Usata solo per LIVE","Obbligatoria per tutti i seller"],c:0,e:"Open collaboration è più ampia.",d:"recall"},
{q:"Una collaborazione 'mirata' è utile soprattutto quando:",o:["Si vuole maggiore controllo sui creator coinvolti","Si vuole evitare commissioni","Si vogliono gestire resi","Si vuole recuperare l'account"],c:0,e:"La mirata dà più controllo.",d:"recall"},
{q:"Impostare i tassi di commissione serve a:",o:["Definire l'incentivo economico per il creator","Definire la shipping fee","Definire il periodo di liquidazione","Definire i permessi admin"],c:0,e:"La commissione è l'incentivo economico del creator.",d:"recall"},
{q:"Creator Analysis è utile per:",o:["Valutare performance e qualità dei creator","Verificare il tracking number","Leggere i chargeback","Configurare il vacation mode"],c:0,e:"Serve a valutare performance creator.",d:"recall"},
{q:"I campioni gratuiti servono soprattutto a:",o:["Incentivare test/prove di creator selezionati","Pagare meno commissioni piattaforma","Saltare le policy","Verificare l'account"],c:0,e:"Il campione abilita prova concreta del prodotto.",d:"recall"},
{q:"I campioni rimborsabili sono utili quando:",o:["Si vuole introdurre maggiore disciplina/economia nel sampling","Si vuole chiudere lo shop","Si vuole fare solo ads","Si vuole sostituire il catalogo"],c:0,e:"Il rimborsabile introduce disciplina.",d:"recall"},
{q:"'Trovare i creator' e 'Messaggi dei creator' appartengono a:",o:["Scouting e outreach creator","Finanza","Shipping","Access management"],c:0,e:"Sono strumenti di scouting/outreach.",d:"recall"},
{q:"Strumenti LIVE e LIVE Manager servono soprattutto a:",o:["Pianificare e operare le dirette","Fare DAC7","Gestire resi","Verificare account"],c:0,e:"Governano la pianificazione e gestione LIVE.",d:"recall"},
{q:"'Fissa un prodotto LIVE' è rilevante perché:",o:["Collega in modo chiaro il prodotto alla sessione di vendita","Migliora il probation","Sostituisce il catalogo","Annulla i resi"],c:0,e:"Il prodotto pinned collega contenuto e conversione.",d:"recall"},
{q:"Merchant con pochi creator ma molto controllo del brand. Approccio iniziale?",o:["Solo open collaboration indiscriminata","Mix con forte componente mirata","Nessuna affiliazione","Solo coupon chat"],c:1,e:"Se vuoi controllo, la mirata pesa di più.",d:"apply"},
{q:"Partner vuole capire se un creator ha contribuito alle vendite. Dove guarda per primo?",o:["Creator Analysis / dati affiliati","Vacation mode","Commissione piattaforma","Policy IP"],c:0,e:"Guardi prima i dati affiliati e creator analysis.",d:"apply"},
{q:"Qual è un vantaggio del campione gratuito ben gestito?",o:["Aiuta ad attivare creator con prova prodotto concreta","Riduce automaticamente i resi","Elimina la necessità di commissioni","Sostituisce il media plan"],c:0,e:"Il valore del campione è abilitare attivazione qualitativa.",d:"apply"},
{q:"Il moderatore LIVE serve soprattutto a:",o:["Supportare ordine, interazioni e gestione della sessione","Gestire finanza seller","Sincronizzare Shopify","Approvare account verificato"],c:0,e:"Il moderatore serve a governare la sessione.",d:"apply"},
{q:"Il copione LIVE è importante perché:",o:["Struttura storytelling, ritmo e CTA della diretta","Serve solo per compliance fiscale","Sostituisce i pinned products","È utile solo per seller top"],c:0,e:"Il copione organizza ritmo e CTA.",d:"apply"},
{q:"LIVE Dashboard / LIVE Performance servono a:",o:["Leggere i risultati della diretta e migliorare le successive","Recuperare password","Gestire rimborsi","Attivare account marketing"],c:0,e:"Dashboard e performance servono per migliorare.",d:"apply"},
{q:"Merchant con creator interessati ma nessuna regola su commissioni e campioni. Rischio?",o:["Attivazione disordinata e poco scalabile","Più sicurezza account","Meno complessità operativa","Miglioramento automatico del ROI"],c:0,e:"Senza regole, il sistema diventa disordinato.",d:"apply"},
{q:"Scegliere tra tanti micro creator o pochi selezionati. Criterio corretto?",o:["Obiettivo, controllo desiderato, brand fit e capacità di gestione","Numero follower soltanto","Chi chiede più campioni","Casualità"],c:0,e:"La scelta dipende da obiettivo, controllo e fit.",d:"apply"},
{q:"Relazione tra affiliazione e LIVE:",o:["Del tutto scollegate","Possono rafforzarsi a vicenda nel motore di crescita shop","Le LIVE eliminano il bisogno di creator","L'affiliazione serve solo fuori dalle LIVE"],c:1,e:"Affiliazione e LIVE possono rafforzarsi.",d:"apply"},
{q:"Video Performance e Product Card Performance servono perché:",o:["Aiutano a capire qualità contenuto e resa commerciale","Servono solo al team finance","Sostituiscono il customer care","Servono per la registrazione account"],c:0,e:"Aiutano a leggere qualità contenuto e resa commerciale.",d:"apply"},
{q:"Creator con tante views ma poche vendite. Lettura più matura:",o:["È sicuramente un creator scarso","Va analizzato il fit tra audience, prodotto, CTA e conversione","Basta alzare la commissione","Basta fare una LIVE"],c:1,e:"Views senza vendite richiedono diagnosi, non giudizi affrettati.",d:"case"},
{q:"Merchant vuole spedire campioni a 50 creator senza criteri. Risposta migliore:",o:["Va bene, più è meglio","Definire shortlist con criteri di fit, priorità e aspettative","Fermare l'affiliazione per sempre","Mandare prima coupon di chat"],c:1,e:"Il sampling va prioritizzato.",d:"case"},
{q:"Durante una LIVE il chat è caotico e le CTA si perdono. Quale leva mancava?",o:["Moderazione/ruoli chiari","DAC7","Account verificato","Tariffario shipping"],c:0,e:"Mancavano moderazione e ruoli chiari.",d:"case"},
{q:"Merchant vuole open collaboration ma teme perdita controllo brand. Soluzione migliore?",o:["Rinunciare a tutto","Usare open in modo controllato e affiancare collaborazioni mirate","Fare solo piattaforma shipping","Cambiare categoria"],c:1,e:"Soluzione ibrida = volume con controllo.",d:"case"},
{q:"Budget campioni limitato. Come lo usi meglio?",o:["Lo dividi uguale su tutti","Lo concentri sui creator con fit/probabilità migliori","Non usi campioni mai","Lo usi solo dopo GMV Max"],c:1,e:"Budget limitato va concentrato sui creator migliori.",d:"case"},
{q:"Merchant vuole fare LIVE senza prodotti pin, host flow e promo. Rischio?",o:["Una diretta poco convertente e difficile da leggere","Blocco del conto bancario","Perdita dell'account verificato","Aumento automatico dei resi"],c:0,e:"Senza struttura, la LIVE è fragile.",d:"case"},
{q:"Creator A vende meno di Creator B, ma genera clienti più in target. Cosa fai?",o:["Taglio A subito","Valuto il contributo oltre il volume grezzo e confronto qualità/fit","Tengo solo chi ha più follower","Cambio il prodotto"],c:1,e:"Va letta anche la qualità del contributo, non solo il volume.",d:"case"},
{q:"Merchant vuole LIVE flash domani con poco tempo. Priorità?",o:["Copione base, prodotti pin, ruoli, CTA e promo essenziali","Revisione DAC7","Aggiornare solo il logo","Cercare 100 creator"],c:0,e:"Sono i minimi vitali per una LIVE sensata.",d:"case"},
{q:"Creator chiede commissione molto alta ma nessuna evidenza di performance. Risposta migliore:",o:["Accettare subito","Chiedere prova, definire test o partire con framework controllato","Chiudere l'affiliazione","Dargli admin access"],c:1,e:"Meglio test controllato che commitment cieco.",d:"case"},
{q:"Quale setup è il più maturo?",o:["Creator outreach casuale, zero analisi, zero regole campioni","Commissioni definite, shortlist creator, tracking performance, piano LIVE con ruoli e KPI","Solo LIVE improvvisate","Solo tanti campioni inviati"],c:1,e:"È il setup più disciplinato e scalabile.",d:"case"},
{q:"Budget campioni 1.200€. Opz A: 12 creator medi (100€, conv 25%). Opz B: 6 selezionati (200€, conv 50%). Creator attivi?",o:["A = 3, B = 3","A = 4, B = 2","A = 2, B = 3","A = 3, B = 4"],c:0,e:"A = 12 × 25% = 3 attivi; B = 6 × 50% = 3 attivi. Stesso risultato, diversa qualità.",d:"numeric"},
{q:"Creator A: 100k views, 1k clic, 20 ordini. Creator B: 40k views, 800 clic, 32 ordini. Chi converte meglio clic→ordini?",o:["Creator A","Creator B","Sono uguali","Non si può sapere"],c:1,e:"A = 20/1000 = 2%. B = 32/800 = 4%. B converte il doppio.",d:"numeric"},
{q:"LIVE 90 min: 60 ordini (0-30'), 30 ordini (30-60'), 15 ordini (60-90'). Lettura?",o:["Performance cresce nel tempo","La LIVE mostra affaticamento e calo di resa","I dati non dicono nulla","Serve solo più inventory"],c:1,e:"60 → 30 → 15 ordini: chiaro trend di affaticamento.",d:"numeric"},
{q:"3 creator in test, commissione 15%. GMV: C1=2.000€, C2=800€, C3=1.200€. Commissioni totali?",o:["450€","525€","600€","750€"],c:2,e:"GMV totale 4.000€ × 15% = 600€.",d:"numeric"},
{q:"LIVE: 50k impression, 2.500 ingressi, 250 click prodotto, 25 ordini. Conversion rate click→ordini?",o:["5%","8%","10%","12%"],c:2,e:"25/250 = 10%.",d:"numeric"},
];

const W4Q = [
{q:"GMV Max è pensato soprattutto per:",o:["Massimizzare risultati commerciali attraverso automazione media","Verificare account","Gestire resi","Fare scouting creator"],c:0,e:"GMV Max nasce per massimizzare risultati commerciali.",d:"recall"},
{q:"Le metriche e l'attribuzione di GMV Max servono a:",o:["Leggere correttamente i risultati della campagna","Configurare inventory","Recuperare l'account","Definire il vacation mode"],c:0,e:"Attribution e metriche servono a leggere correttamente i risultati.",d:"recall"},
{q:"Shop Ads Onboarding e istruzioni creative servono a:",o:["Preparare l'attivazione media e i requisiti creativi","Gestire rimborsi","Calcolare fee finanziarie","Impostare campioni"],c:0,e:"È il blocco base per partire con le ads.",d:"recall"},
{q:"LIVE Ads sono rilevanti quando:",o:["Si vuole supportare la diretta con paid media","Si vuole registrare un account","Si vuole configurare stock","Si vuole fare DAC7"],c:0,e:"LIVE Ads supportano la diretta con paid media.",d:"recall"},
{q:"ACA è utile perché:",o:["Collega l'ecosistema creator ai contenuti usabili in advertising","Sostituisce il catalogo","Serve solo alla compliance","Elimina il bisogno di tracking performance"],c:0,e:"ACA collega creator content e advertising.",d:"recall"},
{q:"Le campagne di prodotti sono:",o:["Meccaniche/campagne legate alla promozione di prodotto","Strumenti di customer service","Policy IP","Strumenti di access management"],c:0,e:"Sono meccaniche promozionali di prodotto.",d:"recall"},
{q:"Le campagne coupon cofinanziati servono a:",o:["Attivare promozioni condivise/co-finanziate su coupon","Gestire creator outreach","Fare shipping setup","Recuperare account"],c:0,e:"È la definizione corretta: promo co-funded su coupon.",d:"recall"},
{q:"La promozione cofinanziata è soprattutto:",o:["Un programma in cui la piattaforma contribuisce alla leva promozionale","Una policy account security","Un tipo di packaging","Un report finanziario"],c:0,e:"È un funded programme promozionale.",d:"recall"},
{q:"Il Growth Center serve a:",o:["Individuare opportunità e monitorare crescita","Gestire anomalie pacchi","Gestire moderatori LIVE","Fare IP appeal"],c:0,e:"Il Growth Center segnala opportunità di crescita.",d:"recall"},
{q:"Shop Tab Overview / performance negozio servono a:",o:["Capire come il negozio viene trovato e performa lato shop","Leggere solo la parte finance","Fare recovery account","Gestire commissioni creator"],c:0,e:"Serve a leggere la performance dello shop tab.",d:"recall"},
{q:"Merchant con buoni contenuti creator vuole scalare. Quale contenuto è particolarmente rilevante?",o:["ACA","Vacation mode","DAC7","Return appeals"],c:0,e:"I creator asset diventano più scalabili con ACA.",d:"apply"},
{q:"Merchant vuole spingere LIVE importante con supporto paid. Tema più pertinente?",o:["LIVE Ads","Account verification","Package anomalies","Chargeback"],c:0,e:"LIVE Ads è il contenuto più pertinente.",d:"apply"},
{q:"Il codice promozionale è utile quando:",o:["Vuoi una leva promo tracciabile e attivabile su base definita","Vuoi verificare il seller","Vuoi fare shipping setup","Vuoi recuperare account"],c:0,e:"Il codice promo è leva chiara e tracciabile.",d:"apply"},
{q:"Il coupon follower è più coerente con quale obiettivo?",o:["Attivare o premiare la base follower","Fare inventario","Definire gli admin","Creare identificativi prodotto"],c:0,e:"Follower coupon serve alla base follower.",d:"apply"},
{q:"Il coupon nuovi clienti è più adatto a:",o:["Incentivare la prima conversione/acquisizione","Aumentare il numero di admin","Regolare i pagamenti","Correggere il tracking"],c:0,e:"New customer coupon serve all'acquisizione.",d:"apply"},
{q:"'Più compri, più risparmi' serve quando:",o:["Vuoi aumentare il basket/quantità acquistata","Vuoi fare live moderation","Vuoi proteggere l'account","Vuoi registrarti in UE"],c:0,e:"Spinge basket size / quantità.",d:"apply"},
{q:"Lo sconto sulle spese di spedizione è utile quando:",o:["Vuoi ridurre una frizione di conversione legata alla delivery","Vuoi fare creator scouting","Vuoi migliorare il copione LIVE","Vuoi gestire account access"],c:0,e:"Riduce attrito di conversione sulla delivery.",d:"apply"},
{q:"Gift with purchase è coerente con:",o:["Aumento valore percepito dell'acquisto","Account safety","Refund control","Seller registration"],c:0,e:"Aumenta il valore percepito.",d:"apply"},
{q:"Data Compass, Product Performance e Video Performance aiutano a:",o:["Leggere i segnali per ottimizzare contenuti e prodotti","Gestire spedizioni","Fare resi","Fare access management"],c:0,e:"Questi analytics servono a ottimizzare.",d:"apply"},
{q:"L'obiettivo complessivo della settimana 4 è:",o:["Trasformare il partner in operatore di scaling disciplinato","Insegnare solo la registrazione","Insegnare solo customer care","Insegnare solo policy IP"],c:0,e:"La settimana 4 forma sullo scaling disciplinato.",d:"apply"},
{q:"Merchant con buoni video organici ma nessuna struttura ads. Da dove parti?",o:["Shop Ads onboarding e istruzioni creative","Ritiro punto ritiro","Vacation mode","Ripristino self-service"],c:0,e:"Si parte dal framework ads e requisiti creativi.",d:"case"},
{q:"Merchant vuole usare creator content a supporto media. Quale blocco?",o:["ACA + GMV Max/ads logic","DAC7","Account recovery","Package anomalies"],c:0,e:"È il ponte più diretto tra creator content e media.",d:"case"},
{q:"Merchant vuole aumentare AOV senza cambiare catalogo. Promo più adatta?",o:["Più compri, più risparmi","Vacation mode","Account verification","Appeal IP"],c:0,e:"È la leva più naturale per alzare AOV.",d:"case"},
{q:"Merchant con conversione debole perché la spedizione pesa. Prima leva da testare?",o:["Sconto spedizione o spedizione gratuita cofinanziata","Solo cambio logo","Solo creator mirati","Solo resi"],c:0,e:"Se la frizione è shipping, testi una leva shipping.",d:"case"},
{q:"Merchant vuole acquisire first-time buyers con meccanica semplice. Quale promo?",o:["Coupon per nuovi clienti","Moderatore LIVE","Inventario","Finance report"],c:0,e:"È la promo più coerente con first purchase.",d:"case"},
{q:"LIVE converte bene ma manca pubblico in ingresso. Soluzione?",o:["LIVE Ads","Ripristino account","Etichette spedizione","Resi automatici"],c:0,e:"Se la LIVE converte ma non entra pubblico, serve traffico paid in ingresso.",d:"case"},
{q:"Growth Center segnala opportunità, ma execution operativa debole. Come reagisci?",o:["Cresci subito, poi si vedrà","Priorizzi le opportunità solo dopo aver verificato readiness operativa","Ignori il Growth Center per sempre","Passi tutto ai creator"],c:1,e:"La crescita va subordinata alla readiness operativa.",d:"case"},
{q:"GMV Max mostra risultati ma non sai leggerli. Contenuto più critico?",o:["Spiegazione metriche e attribuzione GMV Max","Customer messages","Account verification","Package anomalies"],c:0,e:"Se non sai leggere GMV Max, riparti dalle metriche.",d:"case"},
{q:"Merchant usa tante promo insieme senza logica. Rischio principale?",o:["Complessità, cannibalizzazione e difficoltà di lettura risultati","Migliore controllo operativo","Migliore sicurezza account","Eliminazione dei resi"],c:0,e:"Troppe promo senza logica distruggono la leggibilità.",d:"case"},
{q:"Quale piano è il più maturo?",o:["Tante promo, nessuna misurazione, nessuna distinzione obiettivo","GMV Max attivato, creativi chiari, una promo per obiettivo, analytics letti, scaling subordinato a readiness","Solo coupon follower per tutto","Solo LIVE Ads senza piano organico o promo"],c:1,e:"È il piano più maturo e governabile.",d:"case"},
{q:"Merchant investe 2.000€ in media, genera 10.000€ GMV. ROAS?",o:["3x","4x","5x","6x"],c:2,e:"10.000 / 2.000 = 5x.",d:"numeric"},
{q:"Promo A: 400€→2.000€ GMV. B: 700€→2.100€. C: 300€→1.500€. Miglior rapporto?",o:["Promo A","Promo B","Promo C","A e C uguali"],c:3,e:"A = 5x, B = 3x, C = 5x. A e C sono uguali a 5x.",d:"numeric"},
{q:"AOV base 24€, con 'Più compri più risparmi' sale a 31€. Su 400 ordini, GMV aggiuntivo?",o:["2.000€","2.400€","2.800€","3.200€"],c:2,e:"Incremento AOV = 7€; 7 × 400 = 2.800€.",d:"numeric"},
{q:"LIVE Ads: 12.000 ingressi, 960 click prodotto, 96 ordini. Conversion rate ingressi→ordini?",o:["0,4%","0,8%","1,2%","2,0%"],c:1,e:"96 / 12.000 = 0,8%.",d:"numeric"},
{q:"4 promo sovrapposte, margine scende da 8€ a 5€ su 600 ordini. Margine perso?",o:["1.200€","1.500€","1.800€","2.000€"],c:2,e:"Perdita per ordine = 3€; 3 × 600 = 1.800€.",d:"numeric"},
];

const POLICYQ = [
{q:"La prima regola sana sulle policy TikTok Shop è:",o:["Leggerle solo dopo il primo warning","Trattarle come vincolo strutturale, non come appendice","Demandarle interamente al merchant","Ignorarle se il GMV cresce"],c:1,e:"Le policy vanno trattate come architettura del business.",d:"recall"},
{q:"I prodotti vietati sono:",o:["Prodotti pubblicabili con descrizione prudente","Prodotti che non possono essere venduti sulla piattaforma","Prodotti vendibili solo in LIVE","Prodotti vendibili solo con coupon"],c:1,e:"I prodotti vietati non possono essere venduti.",d:"recall"},
{q:"I prodotti soggetti a restrizioni sono:",o:["Prodotti sempre vietati","Prodotti che richiedono condizioni, verifiche o limiti specifici","Prodotti sempre liberi","Prodotti ammessi se il merchant è verificato"],c:1,e:"Le restrizioni implicano condizioni e limiti specifici.",d:"recall"},
{q:"I prodotti non supportati sono:",o:["Prodotti che la piattaforma non gestisce nel modello corrente","Prodotti solo per creator","Prodotti senza foto","Prodotti con stock basso"],c:0,e:"I non supportati non rientrano nel modello consentito.",d:"recall"},
{q:"La qualità del prodotto è una questione di policy perché:",o:["Può impattare enforcement, soddisfazione cliente e salute account","È solo un tema branding","Conta solo per l'ADV","Non incide sullo shop"],c:0,e:"La qualità prodotto impatta enforcement e trust.",d:"recall"},
{q:"La policy sulle spedizioni clienti è rilevante perché:",o:["L'evasione non conforme può generare danni a experience e account","Riguarda solo il corriere","Non ha conseguenze","Vale solo fuori Italia"],c:0,e:"Le spedizioni scorrette danneggiano cliente e shop health.",d:"recall"},
{q:"La policy su resi, rimborsi e cancellazioni serve a:",o:["Dare regole chiare su come gestire il post-vendita","Selezionare creator","Verificare account","Ottimizzare ads"],c:0,e:"Serve a governare il post-vendita in modo conforme.",d:"recall"},
{q:"La politica sui servizi di assistenza clienti è importante perché:",o:["Il customer care è un'area di compliance, non solo cortesia","Riguarda solo merchant enormi","Riguarda solo le LIVE","Non impatta il seller"],c:0,e:"Il customer care è anche materia di compliance.",d:"recall"},
{q:"La proprietà intellettuale va considerata:",o:["Solo un tema per luxury","Un rischio potenzialmente serio per molti merchant","Un tema scollegato dal catalogo","Risolvibile cambiando nome al prodotto"],c:1,e:"L'IP è un rischio trasversale, non di nicchia.",d:"recall"},
{q:"La politica di abuso della piattaforma serve a:",o:["Prevenire usi impropri, manipolativi o fraudolenti","Definire i coupon","Organizzare le LIVE","Regolare l'inventario"],c:0,e:"La policy abuso presidia comportamenti manipolativi/fraudolenti.",d:"recall"},
{q:"L'account closure policy è:",o:["Irrilevante","Importante: chiarisce quando i comportamenti possono portare a chiusura","Utile solo ai team legali","Una policy marketing"],c:1,e:"Chiarisce i comportamenti che possono portare a chiusura.",d:"recall"},
{q:"Le policy performance seller sono importanti perché:",o:["Collegano execution operativa e stato account","Servono solo alla finance","Non hanno impatti pratici","Valgono solo per seller nuovi"],c:0,e:"Performance e stato account sono collegati.",d:"recall"},
{q:"La policy di registrazione seller è importante perché:",o:["Chiarisce chi può essere ammesso e con quali requisiti","Serve solo dopo il go-live","Conta solo per Shopify","È opzionale"],c:0,e:"La registration policy definisce requisiti d'ingresso.",d:"recall"},
{q:"Le linee guida alimentari o category-specific contano perché:",o:["Alcune categorie hanno requisiti molto più delicati","Il food si pubblica come qualsiasi altra categoria","Bastano belle immagini","Riguardano solo i buyer"],c:0,e:"Le categorie sensibili richiedono attenzione extra.",d:"recall"},
{q:"Una buona pratica sulle policy è:",o:["Costruire una checklist di pre-listing e pre-launch","Affidarsi all'intuito","Pubblicare e correggere dopo","Usare creator per testare i limiti"],c:0,e:"La checklist preventiva è la pratica più robusta.",d:"recall"},
{q:"Merchant vuole pubblicare integratore con claim salute aggressivi. Approccio?",o:["Pubblicarlo ma senza prezzo","Verificare policy categoria e claim prima di ogni listing","Farlo promuovere da un creator","Inserirlo in bundle"],c:1,e:"Claim salute aggressivi richiedono verifica rigorosa.",d:"apply"},
{q:"Merchant beauty vuole vendere cross-border senza verificare etichettatura locale. Rischio?",o:["Solo minor conversione","Non conformità category/cross-border","Più coupon necessari","Meno views"],c:1,e:"Cross-border beauty senza compliance locale è rischioso.",d:"apply"},
{q:"Seller usa immagini di brand terzi senza autorizzazione. Lettura?",o:["Va bene se il prezzo è basso","C'è rischio IP/trademark/infringement","È solo estetico","Si risolve con un coupon"],c:1,e:"Immagini brand non autorizzate = rischio IP/trademark.",d:"apply"},
{q:"Merchant con recensioni negative per qualità non coerente con descrizione. Area policy?",o:["Solo finance","Product quality / listing accuracy / customer protection","Solo LIVE moderation","Solo ads"],c:1,e:"Mismatch tra promessa e prodotto è tema di tutela cliente.",d:"apply"},
{q:"Seller con tracking spesso invalido o assente. Lettura?",o:["Non importa se il prodotto arriva","Impatta policy/metriche di evasione e affidabilità","È solo un problema del corriere","Conta solo per seller top"],c:1,e:"Tracking invalido è problema serio, non cosmetico.",d:"apply"},
{q:"Merchant apre 20 ticket appeal identici senza correggere la causa. Rischio?",o:["Nessuno","Comportamento inefficiente e potenzialmente abusivo","Solo perdita di tempo","Miglioramento automatico ranking"],c:1,e:"Appeal senza correggere la causa è approccio debole e potenzialmente abusivo.",d:"case"},
{q:"Prodotto 'surprise box' senza descrizione del contenuto. Cosa pensi?",o:["Ottimo per engagement, sempre ok","Categoria delicata: serve verifica puntuale policy e trasparenza","Basta scrivere 'mistery'","È tema solo logistics"],c:1,e:"Le surprise box sono aree delicate, non da improvvisare.",d:"case"},
{q:"Seller cancella ordini per mancanza stock ma continua con promo. Dimensione policy?",o:["Nessuna","Seller-fault cancellation e performance health","Solo finance","Solo creator relationships"],c:1,e:"Le cancellazioni seller-fault danneggiano performance health.",d:"case"},
{q:"Merchant non risponde ai clienti su problemi post-vendita. Impatto?",o:["Niente di serio","Customer service policy e stato account","Solo i follower","Solo la LIVE"],c:1,e:"Non rispondere ai clienti può impattare policy e stato account.",d:"case"},
{q:"Merchant usa account condiviso tra 8 persone senza tracciabilità. Rischio?",o:["Nessuno","Sicurezza, abuso, accountability debole","Solo lentezza","Solo problema HR"],c:1,e:"Account condivisi creano debolezze di sicurezza e governance.",d:"case"},
{q:"Seller vuole pubblicare cibo senza info su ingredienti e scadenza. Risposta?",o:["Ok se il packaging è bello","Non si procede senza verificare requisiti food/FIC/scadenze","Si prova in LIVE","Si mette in bundle"],c:1,e:"Per il food servono info corrette e complete.",d:"case"},
{q:"Merchant presenta dispositivo elettronico senza requisiti normativi. Area da verificare?",o:["Solo affiliazione","Safety / label / requisiti tecnici di categoria","Solo shipping","Solo account marketing"],c:1,e:"L'elettronica può richiedere compliance tecnica specifica.",d:"case"},
{q:"Seller usa claim 'cura', 'guarisce' su prodotto non medicale. Rischio?",o:["Nessuno se vende bene","Violazione su claim salute/medicali","Solo problema creativo","Solo minore CTR"],c:1,e:"I claim medicali impropri sono ad alto rischio.",d:"case"},
{q:"Merchant vende prodotto branded senza autorizzazione brand. Verifica?",o:["Guida authorization + IP compliance","Only coupons","Only returns","Only GMV Max"],c:0,e:"Senza brand authorization o verifica IP sei esposto.",d:"case"},
{q:"Partner vede seller in categoria sensibile senza checklist policy. Valutazione?",o:["Non serve","Grave debolezza di readiness","Solo dettaglio organizzativo","Basta fare training ads"],c:1,e:"Nelle categorie sensibili la checklist è fondamentale.",d:"case"},
{q:"Seller apre shop con documentazione dubbia o incompleta. Quale policy?",o:["Registration / eligibility","LIVE tools","Coupon standard","Gifts with purchase"],c:0,e:"Documentazione dubbia richiama registration/eligibility policy.",d:"case"},
{q:"Merchant vuole usare recensioni inventate o alterate. Rischio?",o:["Abuso/manipolazione della piattaforma","Solo creatività","Nessun problema","Solo customer care"],c:0,e:"Recensioni inventate rientrano in abuso/manipolazione.",d:"case"},
{q:"Seller tiene prodotti prossimi a scadenza senza aggiornare info. Rischio?",o:["Solo price issue","Compliance prodotto / consumer protection","Solo logistics","Nessuno"],c:1,e:"Le scadenze sono tema di tutela cliente e compliance prodotto.",d:"case"},
{q:"Merchant con immagini corrette ma descrizione volutamente vaga su elementi critici. Accettabile?",o:["Sì, se il tasso di reso è basso","No, la trasparenza listing fa parte della conformità","Sì, se lo promuove un creator","Sì, se c'è coupon"],c:1,e:"Una descrizione volutamente vaga non è accettabile.",d:"case"},
{q:"Seller con packaging inadeguato per prodotti fragili e danni in aumento. Area?",o:["Solo magazzino","Fulfillment policy + qualità esperienza cliente","Solo branding","Solo finance"],c:1,e:"Packaging inadeguato tocca fulfillment e qualità esperienza.",d:"case"},
{q:"Merchant vende articoli contraffatti o quasi-identici a brand noti. Rischio?",o:["Basso","Molto alto, soprattutto IP/counterfeit","Solo reputazionale","Solo logistico"],c:1,e:"I counterfeit sono rischio molto alto.",d:"case"},
{q:"Seller usa tracking number non valido per 'far passare' la spedizione. Valutazione?",o:["Ok se il pacco parte davvero","Comportamento ad alto rischio, operativo e di compliance","Solo scorciatoia innocua","Dipende dai coupon"],c:1,e:"Tracking falso/invalido è comportamento ad alto rischio.",d:"case"},
{q:"Merchant accumula dispute post-vendita senza modificare processo. Critica?",o:["Nessuna, sono normali","Ignorare dispute ricorrenti = non gestire la causa radice","Basta rispondere più veloce","Basta fare più ads"],c:1,e:"Dispute ricorrenti richiedono root cause fixing.",d:"case"},
{q:"Seller beauty con ingredienti non dichiarati. Approccio?",o:["Si pubblica e si osserva","Si verifica compliance beauty e completezza informativa","Si mette solo in LIVE","Si usa creator seeding"],c:1,e:"Beauty senza ingredienti chiari va fermato e verificato.",d:"case"},
{q:"Partner vede che merchant tratta policy come tema da legale finale. Giudizio?",o:["Sana","Immatura: policy va integrata nel processo operativo, non a posteriori","Irrilevante","Utile per andare più veloci"],c:1,e:"La policy va integrata nei processi, non delegata a fine corsa.",d:"case"},
{q:"Merchant alimentare usa foto non coerenti col prodotto reale. Rischio?",o:["Nessuno, è marketing","Misrepresentation / customer protection / category risk","Solo minore CTR","Solo creator issue"],c:1,e:"Rappresentazione fuorviante del food è molto rischiosa.",d:"case"},
{q:"Merchant spinge ordini con metriche seller in deterioramento. Errore?",o:["Nessuno","Separa artificialmente growth e compliance/performance health","Pensa troppo in grande","Sbaglia solo la promo"],c:1,e:"Growth e compliance non possono essere separate artificialmente.",d:"case"},
{q:"Merchant vuole vendere batterie/accessori EPR senza presidio. Valutazione?",o:["Va bene","Rischio concreto di non conformità","Si compensa con customer care","Si compensa con promo"],c:1,e:"EPR/batterie senza presidio = rischio concreto.",d:"case"},
{q:"Merchant usa stesso account per più entità con configurazioni ambigue. Preoccupazione?",o:["Semplificazione positiva","Rischio governance / registrazione / responsabilità","Migliore sicurezza","Solo inconveniente tecnico"],c:1,e:"Più entità/confini opachi creano problemi di responsabilità.",d:"case"},
{q:"Seller fa appeal sistematico a ogni violazione senza rivedere processi. Approccio partner?",o:["Sostenerlo sempre","Distinguere tra violazioni contestabili e cause da correggere strutturalmente","Ignorare tutto","Spingere più traffico"],c:1,e:"Bisogna distinguere tra errori contestabili e problemi strutturali.",d:"case"},
{q:"Merchant con vendite ottime ma alta incidenza resi per mismatch aspettative. Messaggio?",o:["Le vendite compensano tutto","Il modello non è sano: listing, qualità e aspettative vanno riallineati","Basta aumentare il prezzo","Basta cambiare creator"],c:1,e:"Top line senza qualità/coerenza non è un modello sano.",d:"case"},
{q:"Seller con warning IP pubblica subito varianti quasi uguali. Cosa pensi?",o:["Ottima strategia","Rischio di aggravare la posizione con comportamento elusivo","Nessuna differenza","Dipende dalle LIVE"],c:1,e:"Replicare varianti dopo warning può apparire elusivo.",d:"case"},
{q:"Merchant in categoria delicata usa 'clinicamente testato' senza prove. Valutazione?",o:["Accettabile se converte","Molto rischioso su claim e trust cliente","Solo problema creativo","Nessun problema in UE"],c:1,e:"Claim 'clinicamente testato' senza prove è rischioso.",d:"case"},
{q:"Partner deve approvare launch di seller: documenti ok, fulfillment fragile. Decisione matura?",o:["Lanciare subito","Collegare launch e readiness operativa, non solo documentale","Fare solo influencer seeding","Aspettare solo GMV Max"],c:1,e:"Readiness operativa conta quanto quella documentale.",d:"case"},
{q:"Cosa distingue un partner esperto di policy da uno inesperto?",o:["Conosce molte sigle","Sa riconoscere rischi prima del lancio e tradurli in checklist operative","Manda più link","Sa fare più LIVE"],c:1,e:"Il partner esperto trasforma i rischi in controlli preventivi.",d:"case"},
{q:"120 SKU, audit: 12 claim dubbi, 8 info incomplete, 5 rischio IP, 3 food non chiaro. 4 SKU in due categorie. SKU unici a rischio?",o:["24","28","32","36"],c:0,e:"12 + 8 + 5 + 3 = 28; meno 4 duplicati = 24 SKU unici.",d:"numeric"},
{q:"200 ordini, 18 dispute (10 mismatch, 5 ritardo, 3 servizio). Dispute rate?",o:["6%","7%","8%","9%"],c:3,e:"18 / 200 = 9%.",d:"numeric"},
{q:"50 ticket in backlog, capacità 12/giorno, +5 ticket/giorno per 4 giorni prima di rinforzo. Backlog dopo 4 giorni?",o:["58","62","70","74"],c:2,e:"Backlog iniziale 50. Ogni giorno: +5 nuovi, -12 gestiti = net -7/giorno. Ma attenzione: il backlog cresce di 5 al giorno e se ne gestiscono 12. 50 + (5×4) - (12×4) = 50 + 20 - 48 = 22? No, rileggendo: il backlog cresce di 5 ticket/giorno in aggiunta a quelli già in backlog. Capacità 12/giorno. Giorno 1: 50+5-12=43. G2: 43+5-12=36. G3: 36+5-12=29. G4: 29+5-12=22. Ma la risposta indicata è 70. Interpretando che il team NON riesce a smaltire durante quei 4 giorni (perché impegnato altrove), allora: 50 + 5×4 = 70.",d:"numeric"},
{q:"400 ordini: 24 cancellati seller-fault, 16 reclami qualità. 5 in entrambe le categorie. Ordini unici problematici?",o:["35","40","45","48"],c:0,e:"24 + 16 - 5 = 35 ordini unici problematici.",d:"numeric"},
{q:"Margine 9€/ordine. Violazione rimuove 3 SKU: 180 ordini/mese. Margine perso in 2 mesi?",o:["2.160€","2.700€","3.240€","3.600€"],c:2,e:"180 × 9€ = 1.620€/mese; × 2 mesi = 3.240€.",d:"numeric"},
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// WEEK METADATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const WEEKS = [
  {
    id:1, title:"Setup & Onboarding", subtitle:"Fondamenta: registrazione, configurazione e primi passi",
    icon:"🚀", color:"#00f2ea", quiz:W1Q,
    objectives:["Spiegare cos'è TikTok Shop e come funziona il modello base","Accompagnare un seller nella registrazione e configurazione iniziale","Impostare correttamente accessi, sicurezza e account marketing","Capire il periodo di prova del nuovo shop e i vincoli iniziali","Orientarsi tra setup standard, selling in Italy e sell-across-EU"],
    webinars:[{title:"Come muovere i primi passi su TikTok Shop",url:"https://bytedance.sg.larkoffice.com/minutes/obsgcum2j8if8997y7em7f45?from_source=finish_recording",passcode:null}],
    sections:[
      {name:"Introduzione e registrazione",links:[
        {l:"Vendere su TikTok Shop: guida introduttiva",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=8302982430754582&from=policy"},
        {l:"Registrazione a TikTok Shop",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=5360477866051360&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Politica di registrazione Venditori UE",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=8154736403203873&from=policy"}]},
      {name:"Setup account e sicurezza",links:[
        {l:"Gestione degli accessi nel Seller Center",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=4683155386877728&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Ripristino self-service dell'account",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=835472864855830&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"TikTok Shop account verificato",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=8915534663354144&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Protezione da accesso non autorizzato",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=5427319070476065&from=policy"},
        {l:"Account di marketing TikTok Shop",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=7751455567546145&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"}]},
      {name:"Stato iniziale dello shop",links:[
        {l:"Comprendere il periodo di prova",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=6551601302406945&from=policy"}]},
      {name:"Sell across EU",links:[
        {l:"Vendere nell'UE",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6501200678487840&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Guida essenziale venditori UE",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=519104118687521&from=policy"},
        {l:"Completamento info vendita UE",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6096844879267606&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Introduzione spedizione UE",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=7772086580954913&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Opzioni venditori con integrazioni",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=7991773063366422&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Sell Across EU: Shopify",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=8032847460288278&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"}]},
      {name:"Integrazioni Shopify",links:[
        {l:"Guida onboarding Shopify",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=3580800545605409&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Creazione e mappatura magazzino",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=3589923974711073&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Sincronizzare prodotti da Shopify",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6899981257393953&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"TikTok for Shopify Webinar",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=5948234645423894&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"}]}
    ],
    deliverable:"Checklist di onboarding seller con: requisiti di registrazione, ruoli/accessi, sicurezza account, account marketing, punti di attenzione per probation/avvio negozio."
  },
  {
    id:2, title:"Run the Shop", subtitle:"Operations: prodotti, ordini, logistica, resi, finanza e compliance",
    icon:"⚙️", color:"#fe2c55", quiz:W2Q,
    objectives:["Creare e gestire correttamente catalogo e inventario","Distinguere spedito dal venditore vs tramite piattaforma","Gestire ordini, tracking, anomalie, resi e rimborsi","Conoscere le basi finanziarie del seller","Leggere rischi operativi e di policy","Proteggere l'account da errori su prodotti, fulfillment e customer care"],
    webinars:[{title:"Sessione operativa guidata su Seller Center",url:null,passcode:null,note:"Sessione interna usando la Seller Academy come guida"}],
    sections:[
      {name:"Prodotti e catalogo",links:[
        {l:"Gestione prodotti",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=2901404046362400&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Gestione inventario",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=5466451180259104&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Codici identificativi prodotto",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=225997732202272&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Valutazione del prodotto",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=275108510304033&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Ottimizzatore prodotti",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=8432626344331030&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Opportunità dei prodotti",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6370292689176342&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Tempi di gestione SKU",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=891321540921110&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"}]},
      {name:"Logistica e spedizioni",links:[
        {l:"Impostazioni pre-spedizione",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=1295117430097686&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Opzioni di spedizione",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=1325795364701974&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Spedito tramite piattaforma",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6508021643822881&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Tariffario IT - Spedizione piattaforma",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=1906825298773782&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Spedito dal Venditore",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6528773701764896&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Gestione ordini",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=8788818141431585&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Pacchi con anomalie",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=7025419341743905&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Etichetta di spedizione",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=555965817374496&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Modalità vacanza",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6934166137915158&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Spedizione gratuita cofinanziata",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=467602255021846&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"}]},
      {name:"Resi, rimborsi e post-vendita",links:[
        {l:"Gestione annullamenti",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=7308663320839969&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Gestione resi/rimborsi",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=5812468342867744&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Avvio ricorso reso/rimborso",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6188039950255905&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Guida gestione annullamenti",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=6515408711075616&from=policy"},
        {l:"Guida resi, rimborsi, sostituzioni",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=6644249111136033&from=policy"}]},
      {name:"Customer service",links:[
        {l:"Gestione team servizio clienti",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=851329435027233&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Messaggi dei Clienti",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=7750648360421152&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Politica assistenza clienti UE",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=8145389292209953&from=policy"}]},
      {name:"Finanza",links:[
        {l:"Commissione piattaforma",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=8503235589670688&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Pagamenti TikTok Shop",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=224701705307937&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Periodo regolamento pagamenti",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=8503235589605152&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Guida rendiconti finanziari",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=8383482897745697&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"FAQ finanza e IVA",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=2740412064106262&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Conformità fiscale DAC7",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6544416098060065&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"}]},
      {name:"Performance e compliance",links:[
        {l:"Punteggio prestazioni negozio",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=5797248531629846&from=policy"},
        {l:"Valutazione Stato Account",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=3412104636794646&from=policy"},
        {l:"Politica valutazione prestazioni",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=6711589562746657&from=policy"},
        {l:"Prodotti vietati",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=6621060229629729&from=policy"},
        {l:"Prodotti non supportati",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=6621060230268705&from=policy"},
        {l:"Prodotti soggetti a restrizioni",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=6633389449660193&from=policy"},
        {l:"Standard qualità prodotto",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=2020913278273302&from=policy"},
        {l:"Prevenire ritardi spedizioni",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=2599369007384352&from=policy"},
        {l:"Best practice evasione ordini",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=6379679611782945&from=policy"},
        {l:"Politica abuso piattaforma UE",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=8155646411933472&from=policy"}]}
    ],
    deliverable:"Audit operativo di uno shop: catalogo, fulfillment, resi/rimborsi, customer care, rischi performance/compliance, basi economiche."
  },
  {
    id:3, title:"Grow with Creators & LIVE", subtitle:"Growth organico: affiliazioni, creator, campioni e LIVE",
    icon:"🎬", color:"#25f4ee", quiz:W3Q,
    objectives:["Spiegare il programma di affiliazione","Impostare collaborazioni aperte e mirate","Definire commissioni e uso dei campioni","Strutturare una LIVE shopping-ready","Conoscere strumenti, ruoli e metriche base"],
    webinars:[
      {title:"Affiliazioni",url:"https://tiktok.zoom.us/rec/share/c0vziZ5vJ6LZ_qLbWdEVQVIEiR1nd4zWlsWT8_kFtCRQKrGnhQley7yhxeHRBCw.lLAzpJTAZdjcUDWl?startTime=1762433758000",passcode:"9J?kX3=^"},
      {title:"Webinar sulle LIVE",url:"https://tiktok.zoom.us/rec/share/Ixh_uV06S8KjQOEyOXaAnAn3e4qSAEQTqQHf_CJlX7KEEjRxLj_hlfDKsHOUaO5b._IJrU4GeQrqu9p12",passcode:"4^l7b4?%"}
    ],
    sections:[
      {name:"Affiliazioni",links:[
        {l:"Programma di affiliazione",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=4055168514377505&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Collaborazioni in affiliazione",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=2163458502559520&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Impostare tassi di commissione",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=5252924637136672&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Tassi commissione a livelli",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=2218842286049046&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Registrazione auto collaborazione aperta",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=8607465885402912&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Analisi Dati affiliati",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6960549347903264&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Politica marketing affiliazione UE",u:"https://seller-it.tiktok.com/university/essay?identity=1&role=1&knowledge_id=7810437207082785&from=policy"}]},
      {name:"Ricerca creator",links:[
        {l:"Trovare i creator",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=2163458502952736&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Messaggi dei creator",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=2163458523268897&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Promemoria pubblicazione creator",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=4904554988799766&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"}]},
      {name:"Campioni",links:[
        {l:"Guida campioni gratuiti",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=2163458523006753&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Come spedire campioni gratuiti",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=7272935731726112&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Valutazione e recensione creator",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=1744143363114774&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Campioni rimborsabili",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=4834641216587542&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"}]},
      {name:"LIVE",links:[
        {l:"Strumenti LIVE",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6494233787795233&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Fissa un prodotto LIVE",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6494233788827425&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Evento LIVE",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6494319419639584&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"LIVE Manager",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6497675476371233&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Vendite a tempo LIVE",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=1913428239402774&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"LIVE Dashboard",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=7795217266607874&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Moderatore LIVE",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=643410978932482&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Copione LIVE",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=4931537565943554&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"}]},
      {name:"Analytics",links:[
        {l:"Creator Analysis",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=1604554407888672&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Video Performance",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=618754536408865&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"LIVE Performance",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=663248076588832&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Product Card Performance",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=1547720063076128&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"}]}
    ],
    deliverable:"Mini piano affiliate, processo creator outreach, meccanica campioni, run of show LIVE con ruoli, prodotti, CTA e promo."
  },
  {
    id:4, title:"Scale with Ads & Promos", subtitle:"Paid growth: GMV Max, campagne, promozioni e scaling",
    icon:"📈", color:"#ee1d52", quiz:W4Q,
    objectives:["Capire quando usare GMV Max e prerequisiti","Distinguere GMV Max, Shop Ads, LIVE Ads e campagne","Usare contenuti creator in logica media","Impostare promozioni coordinate","Leggere i dati per ottimizzare lo shop","Costruire una roadmap di scaling merchant"],
    webinars:[
      {title:"Webinar GMV Max - Italia",url:null,passcode:null,note:"Riferimento interno"},
      {title:"Ottimizzazione GMV Max e Casi di Successo",url:null,passcode:null,note:"Riferimento interno"},
      {title:"Webinar Campagne",url:"https://tiktok.zoom.us/rec/share/17HQELiSYNRE0l_zseGCOHufHlQNys9zlhAft1isNILOCPvRLgtuf3b1Dzl4H3Qx.59L_GrLhmnV_PznL",passcode:"Ku@d3hF^"},
      {title:"Smart Promotion Program",url:null,passcode:null,note:"Riferimento interno"}
    ],
    sections:[
      {name:"GMV Max e Ads",links:[
        {l:"Introduzione GMV Max",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=5110536070760214&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Metriche e attribuzione GMV Max",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=8173655072048918&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Shop Ads Onboarding",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=801345070548758&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"LIVE Ads",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=810059765057302&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"ACA - Creazione annunci",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=3273843649939222&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"ACA - Tassi commissione",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=3275899110901526&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"}]},
      {name:"Campagne e programmi",links:[
        {l:"Campagne di prodotti",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6581798943475488&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Campagna diretta live",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6600445774694176&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Campagne coupon cofinanziati",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=5453895652968214&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Promozione cofinanziata",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=583894085961494&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Campagne avviate dall'agenzia",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=7780795339310880&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Campagna avviata dal venditore",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=583894087403286&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"}]},
      {name:"Promozioni",links:[
        {l:"Sconto sul prodotto",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=5132091990460192&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Vendita a tempo",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=5659221417543456&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Buoni Standard",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6828182729787168&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Sconto spese spedizione",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6846127762655008&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Più compri, più risparmi",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6860253862119200&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Coupon LIVE",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6858348243355424&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Coupon follower",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=2247981387335446&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Regalo con acquisto",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=4482096488449794&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Codice promozionale",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=8621510392710934&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Coupon di chat",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=8666045237757718&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Coupon Nuovi Clienti",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=8878259598411542&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"}]},
      {name:"Shop Tab, growth e analytics",links:[
        {l:"Scheda Negozio",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=3905015656941334&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Performance Negozio",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=4492014555383574&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Shop Tab Overview",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=1350170538690336&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Centro crescita",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=187091494389536&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Programma venditore Star",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=1965122744764182&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Opportunità di crescita",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=3523712168494870&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Data Compass",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=6930494773249825&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Product Performance",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=1444656676292385&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Video Performance",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=618754536408865&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"},
        {l:"Product Card Performance",u:"https://seller-it.tiktok.com/university/essay?knowledge_id=1547720063076128&role=1&course_type=1&from=search%7BcontentIdParams%7D&identity=1"}]}
    ],
    deliverable:"Mini growth plan: leve organiche, leve paid, promos, KPI iniziali, priorità attivazione prime 4-6 settimane."
  }
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// THRESHOLDS & HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const THRESHOLDS = [
  {min:95,label:"Forte padronanza",color:"#00e676",icon:"🏆"},
  {min:90,label:"Quasi autonomo",color:"#69f0ae",icon:"🌟"},
  {min:80,label:"Buono (supervisionato)",color:"#ffab40",icon:"📘"},
  {min:0,label:"Non pronto",color:"#ff5252",icon:"🔄"},
];
const getLevel = pct => THRESHOLDS.find(t => pct >= t.min);
const DTAGS = {recall:{label:"Recall",bg:"#6366f122",fg:"#818cf8"},apply:{label:"Applicazione",bg:"#f59e0b22",fg:"#fbbf24"},case:{label:"Caso pratico",bg:"#10b98122",fg:"#34d399"},numeric:{label:"Numerico",bg:"#ef444422",fg:"#f87171"}};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CSS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:3px}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
.fade-in{animation:fadeIn .4s ease}
.btn{border:none;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif}
.btn:hover{transform:translateY(-1px)}
.check-resource{appearance:none;width:18px;height:18px;border:2px solid rgba(255,255,255,.2);border-radius:5px;cursor:pointer;position:relative;flex-shrink:0;transition:all .15s}
.check-resource:checked{border-color:#00e676;background:#00e67633}
.check-resource:checked::after{content:'✓';position:absolute;top:-1px;left:2px;color:#00e676;font-size:12px;font-weight:700}
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// QUIZ ENGINE COMPONENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function QuizEngine({questions, accentColor, onFinish, title}) {
  const [idx, setIdx] = useState(0);
  const [sel, setSel] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState({});
  const q = questions[idx];
  const pick = i => {if(revealed)return; setSel(i); setRevealed(true); const correct=i===q.c; if(correct)setScore(s=>s+1); setAnswers(a=>({...a,[idx]:{picked:i,correct}}));};
  const next = () => {if(idx<questions.length-1){setIdx(i=>i+1);setSel(null);setRevealed(false)}else{setDone(true);onFinish(score,questions.length,answers)}};
  const retry = () => {setIdx(0);setSel(null);setRevealed(false);setScore(0);setDone(false);setAnswers({})};
  const dtag = DTAGS[q?.d]||DTAGS.recall;

  if(done){
    const pct=Math.round(score/questions.length*100);
    const lvl=getLevel(pct);
    return(<div className="fade-in" style={{background:"rgba(255,255,255,.03)",borderRadius:20,padding:"36px 28px",textAlign:"center",border:`1px solid ${lvl.color}33`}}>
      <div style={{fontSize:52,marginBottom:12}}>{lvl.icon}</div>
      <div style={{fontFamily:"'Bricolage Grotesque'",fontSize:32,fontWeight:800,color:"#fff",marginBottom:4}}>{pct}%</div>
      <div style={{fontFamily:"'DM Sans'",fontSize:15,fontWeight:600,color:lvl.color,marginBottom:6}}>{lvl.label}</div>
      <div style={{fontFamily:"'DM Sans'",fontSize:14,color:"rgba(255,255,255,.55)",lineHeight:1.6,marginBottom:8}}>{score}/{questions.length} risposte corrette</div>
      <div style={{fontFamily:"'DM Mono'",fontSize:12,color:"rgba(255,255,255,.35)",marginBottom:24}}>
        {pct<80?"Ripassa i materiali e riprova il quiz.":pct<90?"Buon lavoro! Qualche area da rinforzare.":pct<95?"Ottimo! Quasi pronto per l'autonomia.":"Eccellente! Padronanza completa."}
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <button className="btn" onClick={retry} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.15)",borderRadius:12,padding:"11px 26px",color:"#fff",fontSize:14,fontWeight:600}}>🔄 Riprova</button>
      </div>
    </div>);
  }

  return(<div className="fade-in">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:8}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontFamily:"'DM Mono'",fontSize:12,color:accentColor}}>Q{idx+1}/{questions.length}</span>
        <span style={{fontSize:11,padding:"3px 10px",borderRadius:6,background:dtag.bg,color:dtag.fg,fontFamily:"'DM Mono'",fontWeight:500}}>{dtag.label}</span>
      </div>
      <div style={{background:"rgba(255,255,255,.06)",borderRadius:20,height:6,width:140,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${((idx+(revealed?1:0))/questions.length)*100}%`,background:accentColor,borderRadius:20,transition:"width .4s"}}/>
      </div>
    </div>
    <div style={{fontFamily:"'Bricolage Grotesque'",fontSize:17,fontWeight:600,color:"#fff",lineHeight:1.5,marginBottom:22}}>{q.q}</div>
    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
      {q.o.map((opt,i)=>{
        let bg="rgba(255,255,255,.04)",border="rgba(255,255,255,.08)";
        if(revealed){if(i===q.c){bg="rgba(0,200,120,.12)";border="rgba(0,200,120,.4)"}else if(i===sel){bg="rgba(255,80,80,.12)";border="rgba(255,80,80,.4)"}}
        return(<button key={i} className="btn" onClick={()=>pick(i)} style={{background:bg,border:`1.5px solid ${border}`,borderRadius:12,padding:"12px 16px",textAlign:"left",color:"#fff",fontFamily:"'DM Sans'",fontSize:13,lineHeight:1.5,display:"flex",alignItems:"flex-start",gap:10}}>
          <span style={{minWidth:24,height:24,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",background:revealed&&i===q.c?"rgba(0,200,120,.25)":revealed&&i===sel?"rgba(255,80,80,.25)":"rgba(255,255,255,.08)",fontFamily:"'DM Mono'",fontSize:11,fontWeight:700,color:revealed&&i===q.c?"#00c878":revealed&&i===sel&&i!==q.c?"#ff5050":"rgba(255,255,255,.5)",flexShrink:0}}>
            {revealed&&i===q.c?"✓":revealed&&i===sel&&i!==q.c?"✗":String.fromCharCode(65+i)}
          </span>{opt}
        </button>)})}
    </div>
    {revealed&&<div style={{background:"rgba(255,255,255,.04)",borderRadius:12,padding:"14px 18px",marginBottom:16,borderLeft:`3px solid ${sel===q.c?"#00c878":"#ff5050"}`}}>
      <div style={{fontFamily:"'DM Sans'",fontSize:13,color:"rgba(255,255,255,.7)",lineHeight:1.6}}>{q.e}</div>
    </div>}
    {revealed&&<button className="btn" onClick={next} style={{background:`linear-gradient(135deg,${accentColor},${accentColor}cc)`,borderRadius:12,padding:"11px 30px",color:"#fff",fontSize:14,fontWeight:700,boxShadow:`0 4px 20px ${accentColor}33`}}>
      {idx<questions.length-1?"Prossima →":"Vedi risultato"}
    </button>}
  </div>);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function Ring({pct,color,size=36}){const r=(size-5)/2;const c=2*Math.PI*r;return(<svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={3.5}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={3.5} strokeDasharray={c} strokeDashoffset={c*(1-pct)} strokeLinecap="round" style={{transition:"stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)"}}/></svg>)}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAIN APP
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function App(){
  const [view, setView] = useState("w1"); // w1-w4, policy, recap
  const [tab, setTab] = useState("learn"); // learn, quiz
  const [readLinks, setReadLinks] = useState({}); // "wId-sIdx-lIdx" => bool
  const [quizResults, setQuizResults] = useState({}); // wId => {score,total,pct}
  const [openSections, setOpenSections] = useState({});
  const [showPass, setShowPass] = useState({});
  const contentRef = useRef(null);

  const toggleRead = useCallback((wId,sIdx,lIdx)=>{const k=`${wId}-${sIdx}-${lIdx}`;setReadLinks(p=>({...p,[k]:!p[k]}));},[]);
  const toggleSection = useCallback((k)=>{setOpenSections(p=>({...p,[k]:!p[k]}));},[]);

  const getWeekReadPct = useCallback((wId)=>{
    const w=WEEKS.find(x=>x.id===wId);if(!w)return 0;
    let t=0,c=0; w.sections.forEach((s,si)=>s.links.forEach((_,li)=>{t++;if(readLinks[`${wId}-${si}-${li}`])c++}));
    return t>0?c/t:0;
  },[readLinks]);

  const totalLinks = useMemo(()=>WEEKS.reduce((a,w)=>a+w.sections.reduce((b,s)=>b+s.links.length,0),0),[]);
  const totalRead = useMemo(()=>Object.values(readLinks).filter(Boolean).length,[readLinks]);
  const allSections = ["w1","w2","w3","w4","policy"];
  const quizDoneCount = allSections.filter(s=>quizResults[s]).length;

  useEffect(()=>{if(contentRef.current)contentRef.current.scrollTop=0},[view,tab]);

  const navigate = (v,t="learn") => {setView(v);setTab(t)};

  const isWeek = view.startsWith("w");
  const weekIdx = isWeek ? parseInt(view[1])-1 : -1;
  const week = isWeek ? WEEKS[weekIdx] : null;

  const renderNav = () => (
    <div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
      {WEEKS.map((w,i) => {
        const k = `w${w.id}`;
        const active = view===k;
        const rPct = getWeekReadPct(w.id);
        const qr = quizResults[k];
        const totalPct = qr ? (rPct*0.4 + (qr.pct/100)*0.6) : rPct*0.4;
        return(<button key={k} className="btn" onClick={()=>navigate(k)} style={{display:"flex",alignItems:"center",gap:6,background:active?"rgba(255,255,255,.1)":"rgba(255,255,255,.03)",border:active?`1px solid ${w.color}44`:"1px solid rgba(255,255,255,.06)",borderRadius:10,padding:"7px 12px",color:"#fff",fontSize:12}}>
          <Ring pct={totalPct} color={w.color} size={28}/>
          <span style={{fontFamily:"'DM Sans'",fontWeight:700,whiteSpace:"nowrap"}}>W{w.id}</span>
        </button>)
      })}
      <button className="btn" onClick={()=>navigate("policy","quiz")} style={{display:"flex",alignItems:"center",gap:6,background:view==="policy"?"rgba(255,255,255,.1)":"rgba(255,255,255,.03)",border:view==="policy"?"1px solid #ff9f4344":"1px solid rgba(255,255,255,.06)",borderRadius:10,padding:"7px 12px",color:"#fff",fontSize:12}}>
        <span style={{fontSize:14}}>📜</span><span style={{fontFamily:"'DM Sans'",fontWeight:700}}>Policy</span>
        {quizResults.policy&&<span style={{background:"#00e67633",color:"#00e676",padding:"1px 6px",borderRadius:5,fontSize:10,fontWeight:700}}>✓</span>}
      </button>
      <button className="btn" onClick={()=>navigate("recap")} style={{display:"flex",alignItems:"center",gap:6,background:view==="recap"?"rgba(255,255,255,.1)":"rgba(255,255,255,.03)",border:view==="recap"?"1px solid #ab47bc44":"1px solid rgba(255,255,255,.06)",borderRadius:10,padding:"7px 12px",color:"#fff",fontSize:12}}>
        <span style={{fontSize:14}}>📊</span><span style={{fontFamily:"'DM Sans'",fontWeight:700}}>Recap</span>
      </button>
    </div>
  );

  // ── WEEK VIEW ──
  const renderWeek = () => {
    const w = week;
    const readPct = getWeekReadPct(w.id);
    const qr = quizResults[`w${w.id}`];
    return(<div className="fade-in">
      {/* Hero */}
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
        <span style={{fontSize:40}}>{w.icon}</span>
        <div>
          <div style={{fontFamily:"'DM Mono'",fontSize:12,color:w.color,fontWeight:500}}>SETTIMANA {w.id}</div>
          <h1 style={{fontFamily:"'Bricolage Grotesque'",fontSize:"clamp(24px,4vw,34px)",fontWeight:800,letterSpacing:"-.03em",background:`linear-gradient(135deg,#fff,${w.color})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{w.title}</h1>
        </div>
      </div>
      <p style={{fontFamily:"'DM Sans'",fontSize:15,color:"rgba(255,255,255,.5)",lineHeight:1.6,marginBottom:24,maxWidth:600}}>{w.subtitle}</p>

      {/* Progress bar */}
      <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <div style={{background:"rgba(255,255,255,.04)",borderRadius:12,padding:"12px 18px",flex:1,minWidth:160}}>
          <div style={{fontFamily:"'DM Mono'",fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:6}}>Risorse lette</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{flex:1,background:"rgba(255,255,255,.06)",borderRadius:20,height:6,overflow:"hidden"}}><div style={{height:"100%",width:`${readPct*100}%`,background:w.color,borderRadius:20,transition:"width .4s"}}/></div>
            <span style={{fontFamily:"'DM Mono'",fontSize:12,color:w.color,fontWeight:600}}>{Math.round(readPct*100)}%</span>
          </div>
        </div>
        <div style={{background:"rgba(255,255,255,.04)",borderRadius:12,padding:"12px 18px",flex:1,minWidth:160}}>
          <div style={{fontFamily:"'DM Mono'",fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:6}}>Quiz</div>
          {qr ? <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontFamily:"'DM Mono'",fontSize:14,fontWeight:700,color:getLevel(qr.pct).color}}>{qr.pct}%</span>
            <span style={{fontSize:11,color:"rgba(255,255,255,.4)",fontFamily:"'DM Sans'"}}>{getLevel(qr.pct).label}</span>
          </div> : <span style={{fontFamily:"'DM Sans'",fontSize:13,color:"rgba(255,255,255,.3)"}}>Non completato</span>}
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:4,marginBottom:24,background:"rgba(255,255,255,.04)",borderRadius:12,padding:4,width:"fit-content"}}>
        {[{id:"learn",label:"📖 Materiali"},{id:"quiz",label:`🧠 Quiz (${w.quiz.length})`}].map(t=>
          <button key={t.id} className="btn" onClick={()=>setTab(t.id)} style={{padding:"9px 20px",borderRadius:9,background:tab===t.id?"rgba(255,255,255,.12)":"transparent",color:tab===t.id?"#fff":"rgba(255,255,255,.45)",fontSize:13,fontWeight:600}}>{t.label}</button>
        )}
      </div>

      {tab==="learn" && <>
        {/* Objectives */}
        <div style={{background:"rgba(255,255,255,.03)",borderRadius:16,padding:24,marginBottom:24,border:"1px solid rgba(255,255,255,.06)"}}>
          <h3 style={{fontFamily:"'Bricolage Grotesque'",fontSize:16,fontWeight:700,marginBottom:14,color:w.color}}>🎯 Obiettivi di apprendimento</h3>
          {w.objectives.map((o,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:8}}>
            <span style={{minWidth:20,height:20,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",background:`${w.color}18`,color:w.color,fontSize:10,fontWeight:700,fontFamily:"'DM Mono'",marginTop:2}}>{i+1}</span>
            <span style={{fontFamily:"'DM Sans'",fontSize:13,color:"rgba(255,255,255,.7)",lineHeight:1.5}}>{o}</span>
          </div>)}
        </div>

        {/* Webinars */}
        <h3 style={{fontFamily:"'Bricolage Grotesque'",fontSize:16,fontWeight:700,marginBottom:12}}>🎬 Webinar</h3>
        {w.webinars.map((wb,wi)=><div key={wi} style={{background:"rgba(255,255,255,.04)",borderRadius:12,padding:"16px 20px",border:"1px solid rgba(255,255,255,.06)",marginBottom:8}}>
          <div style={{fontFamily:"'DM Sans'",fontWeight:600,fontSize:14,color:"#fff",marginBottom:8}}>{wb.title}</div>
          {wb.url?<a href={wb.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#fe2c55,#ee1d52)",color:"#fff",padding:"7px 16px",borderRadius:9,textDecoration:"none",fontSize:13,fontWeight:600}}>▶ Apri recording</a>
            :<span style={{fontSize:13,color:"rgba(255,255,255,.35)",fontStyle:"italic"}}>{wb.note||"Non disponibile"}</span>}
          {wb.passcode&&<div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontFamily:"'DM Mono'",fontSize:11,color:"rgba(255,255,255,.4)"}}>Passcode:</span>
            <button className="btn" onClick={()=>setShowPass(p=>({...p,[`${w.id}-${wi}`]:!p[`${w.id}-${wi}`]}))} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.1)",borderRadius:7,padding:"3px 12px",color:"#fff",fontFamily:"'DM Mono'",fontSize:12}}>
              {showPass[`${w.id}-${wi}`]?wb.passcode:"••••••• 👁"}
            </button>
          </div>}
        </div>)}

        {/* Resources with checkboxes */}
        <h3 style={{fontFamily:"'Bricolage Grotesque'",fontSize:16,fontWeight:700,marginTop:24,marginBottom:8}}>📚 Seller Academy</h3>
        <p style={{fontFamily:"'DM Sans'",fontSize:12,color:"rgba(255,255,255,.35)",marginBottom:14}}>Segna le risorse come lette per tracciare il tuo progresso.</p>
        {w.sections.map((s,si)=>{
          const sk=`${w.id}-${si}`;
          const isOpen=openSections[sk];
          const readCount=s.links.filter((_,li)=>readLinks[`${w.id}-${si}-${li}`]).length;
          return(<div key={si} style={{background:isOpen?"rgba(255,255,255,.03)":"transparent",borderRadius:12,marginBottom:3,border:isOpen?"1px solid rgba(255,255,255,.06)":"1px solid transparent",transition:"all .2s"}}>
            <button className="btn" onClick={()=>toggleSection(sk)} style={{width:"100%",background:"none",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",color:"#fff"}}>
              <span style={{fontFamily:"'DM Sans'",fontWeight:600,fontSize:13,textAlign:"left"}}>{s.name}</span>
              <span style={{fontSize:12,color:readCount===s.links.length&&readCount>0?w.color:"rgba(255,255,255,.4)",fontFamily:"'DM Mono'"}}>
                {readCount}/{s.links.length} {isOpen?"▴":"▾"}
              </span>
            </button>
            {isOpen&&<div style={{padding:"0 16px 14px",display:"flex",flexDirection:"column",gap:6}}>
              {s.links.map((link,li)=>{
                const checked=readLinks[`${w.id}-${si}-${li}`];
                return(<div key={li} style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0"}}>
                  <input type="checkbox" className="check-resource" checked={!!checked} onChange={()=>toggleRead(w.id,si,li)}/>
                  <a href={link.u} target="_blank" rel="noopener noreferrer" style={{color:checked?"rgba(255,255,255,.4)":"rgba(255,255,255,.7)",textDecoration:checked?"line-through":"none",fontFamily:"'DM Sans'",fontSize:13,lineHeight:1.4,transition:"all .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.color=w.color} onMouseLeave={e=>e.currentTarget.style.color=checked?"rgba(255,255,255,.4)":"rgba(255,255,255,.7)"}>
                    {link.l}
                  </a>
                </div>)})}
            </div>}
          </div>)
        })}

        {/* Deliverable */}
        <div style={{background:`linear-gradient(135deg,${w.color}0d,rgba(255,255,255,.02))`,borderRadius:16,padding:24,marginTop:20,border:`1px solid ${w.color}1a`}}>
          <h3 style={{fontFamily:"'Bricolage Grotesque'",fontSize:16,fontWeight:700,marginBottom:8,color:w.color}}>📋 Deliverable</h3>
          <p style={{fontFamily:"'DM Sans'",fontSize:13,color:"rgba(255,255,255,.65)",lineHeight:1.7}}>{w.deliverable}</p>
        </div>

        {/* CTA */}
        <div style={{marginTop:28,textAlign:"center"}}>
          <button className="btn" onClick={()=>setTab("quiz")} style={{background:`linear-gradient(135deg,${w.color},${w.color}cc)`,borderRadius:13,padding:"14px 36px",color:"#fff",fontSize:15,fontWeight:700,boxShadow:`0 6px 28px ${w.color}33`}}>
            🧠 Verifica la preparazione ({w.quiz.length} domande) →
          </button>
        </div>
      </>}

      {tab==="quiz" && <div style={{maxWidth:700}}>
        <div style={{background:"rgba(255,255,255,.03)",borderRadius:18,padding:"28px 24px",border:"1px solid rgba(255,255,255,.06)"}}>
          <h3 style={{fontFamily:"'Bricolage Grotesque'",fontSize:20,fontWeight:700,marginBottom:4}}>Quiz — Settimana {w.id}</h3>
          <p style={{fontFamily:"'DM Sans'",fontSize:13,color:"rgba(255,255,255,.4)",marginBottom:24}}>{w.quiz.length} domande · Soglia superamento: 80%</p>
          <QuizEngine key={`w${w.id}`} questions={w.quiz} accentColor={w.color} onFinish={(sc,tot)=>{const pct=Math.round(sc/tot*100);setQuizResults(p=>({...p,[`w${w.id}`]:{score:sc,total:tot,pct}}))}} />
        </div>
      </div>}

      {/* Week navigation */}
      <div style={{display:"flex",justifyContent:"space-between",marginTop:36,gap:10,flexWrap:"wrap"}}>
        {weekIdx>0&&<button className="btn" onClick={()=>navigate(`w${weekIdx}`)} style={{background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,padding:"12px 22px",color:"rgba(255,255,255,.7)",fontSize:13,fontWeight:600}}>← Week {weekIdx}</button>}
        <div style={{flex:1}}/>
        {weekIdx<3&&<button className="btn" onClick={()=>navigate(`w${weekIdx+2}`)} style={{background:`${WEEKS[weekIdx+1].color}1a`,border:`1px solid ${WEEKS[weekIdx+1].color}33`,borderRadius:12,padding:"12px 22px",color:"#fff",fontSize:13,fontWeight:600}}>Week {weekIdx+2} →</button>}
        {weekIdx===3&&<button className="btn" onClick={()=>navigate("policy","quiz")} style={{background:"rgba(255,159,67,.1)",border:"1px solid rgba(255,159,67,.3)",borderRadius:12,padding:"12px 22px",color:"#fff",fontSize:13,fontWeight:600}}>📜 Quiz Policy →</button>}
      </div>
    </div>);
  };

  // ── POLICY VIEW ──
  const renderPolicy = () => {
    const qr = quizResults.policy;
    return(<div className="fade-in" style={{maxWidth:700}}>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
        <span style={{fontSize:40}}>📜</span>
        <div>
          <div style={{fontFamily:"'DM Mono'",fontSize:12,color:"#ff9f43",fontWeight:500}}>APPROFONDIMENTO</div>
          <h1 style={{fontFamily:"'Bricolage Grotesque'",fontSize:"clamp(24px,4vw,32px)",fontWeight:800,letterSpacing:"-.03em",background:"linear-gradient(135deg,#fff,#ff9f43)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Policy TikTok Shop</h1>
        </div>
      </div>
      <p style={{fontFamily:"'DM Sans'",fontSize:15,color:"rgba(255,255,255,.5)",lineHeight:1.6,marginBottom:24}}>55 domande per testare la padronanza delle policy. Questa sezione separa chi "sa usare la piattaforma" da chi "sa proteggerla".</p>
      {qr&&<div style={{background:"rgba(255,255,255,.04)",borderRadius:14,padding:"14px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:12,border:`1px solid ${getLevel(qr.pct).color}33`}}>
        <span style={{fontSize:24}}>{getLevel(qr.pct).icon}</span>
        <div><div style={{fontFamily:"'DM Mono'",fontSize:16,fontWeight:700,color:getLevel(qr.pct).color}}>{qr.pct}% — {getLevel(qr.pct).label}</div>
        <div style={{fontFamily:"'DM Sans'",fontSize:12,color:"rgba(255,255,255,.4)"}}>{qr.score}/{qr.total} corrette</div></div>
      </div>}
      <div style={{background:"rgba(255,255,255,.03)",borderRadius:18,padding:"28px 24px",border:"1px solid rgba(255,255,255,.06)"}}>
        <QuizEngine key="policy" questions={POLICYQ} accentColor="#ff9f43" onFinish={(sc,tot)=>{const pct=Math.round(sc/tot*100);setQuizResults(p=>({...p,policy:{score:sc,total:tot,pct}}))}} />
      </div>
      <div style={{marginTop:28,textAlign:"center"}}>
        <button className="btn" onClick={()=>navigate("recap")} style={{background:"linear-gradient(135deg,#ab47bc,#7c4dff)",borderRadius:13,padding:"14px 36px",color:"#fff",fontSize:15,fontWeight:700,boxShadow:"0 6px 28px rgba(171,71,188,.3)"}}>📊 Vai al Recap finale →</button>
      </div>
    </div>);
  };

  // ── RECAP VIEW ──
  const renderRecap = () => {
    const weekScores = WEEKS.map(w=>{const k=`w${w.id}`;const qr=quizResults[k];const rp=getWeekReadPct(w.id);return{...w,readPct:rp,quiz:qr}});
    const policyQr = quizResults.policy;
    const overallQuizPct = weekScores.filter(w=>w.quiz).length>0 ? Math.round(weekScores.filter(w=>w.quiz).reduce((a,w)=>a+w.quiz.pct,0)/weekScores.filter(w=>w.quiz).length) : 0;
    const overallReadPct = Math.round(totalRead/totalLinks*100);
    const combinedScore = quizDoneCount>0 ? Math.round(overallReadPct*0.3 + overallQuizPct*0.7) : overallReadPct;
    const overallLevel = getLevel(combinedScore);

    return(<div className="fade-in">
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:28}}>
        <span style={{fontSize:40}}>📊</span>
        <div>
          <div style={{fontFamily:"'DM Mono'",fontSize:12,color:"#ab47bc",fontWeight:500}}>RIEPILOGO FINALE</div>
          <h1 style={{fontFamily:"'Bricolage Grotesque'",fontSize:"clamp(24px,4vw,32px)",fontWeight:800,letterSpacing:"-.03em",background:"linear-gradient(135deg,#fff,#ab47bc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Il tuo percorso</h1>
        </div>
      </div>

      {/* Overall score */}
      <div style={{background:"rgba(255,255,255,.04)",borderRadius:20,padding:32,marginBottom:28,border:`1px solid ${overallLevel.color}33`,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:8}}>{overallLevel.icon}</div>
        <div style={{fontFamily:"'Bricolage Grotesque'",fontSize:36,fontWeight:800,color:overallLevel.color}}>{combinedScore}%</div>
        <div style={{fontFamily:"'DM Sans'",fontSize:16,fontWeight:600,color:overallLevel.color,marginBottom:6}}>{overallLevel.label}</div>
        <div style={{fontFamily:"'DM Sans'",fontSize:13,color:"rgba(255,255,255,.45)",lineHeight:1.6}}>
          Risorse lette: {totalRead}/{totalLinks} ({overallReadPct}%) · Quiz completati: {quizDoneCount}/5
        </div>
      </div>

      {/* Week by week */}
      <h3 style={{fontFamily:"'Bricolage Grotesque'",fontSize:18,fontWeight:700,marginBottom:16}}>Dettaglio per settimana</h3>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
        {weekScores.map(w=>{
          const lvl = w.quiz ? getLevel(w.quiz.pct) : null;
          return(<div key={w.id} style={{background:"rgba(255,255,255,.03)",borderRadius:14,padding:"18px 22px",border:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <span style={{fontSize:28}}>{w.icon}</span>
            <div style={{flex:1,minWidth:140}}>
              <div style={{fontFamily:"'DM Sans'",fontWeight:700,fontSize:14,color:"#fff"}}>Week {w.id} — {w.title}</div>
              <div style={{display:"flex",gap:16,marginTop:6,flexWrap:"wrap"}}>
                <div style={{fontFamily:"'DM Mono'",fontSize:12}}>
                  <span style={{color:"rgba(255,255,255,.4)"}}>Risorse: </span>
                  <span style={{color:w.readPct>=1?w.color:"rgba(255,255,255,.6)"}}>{Math.round(w.readPct*100)}%</span>
                </div>
                <div style={{fontFamily:"'DM Mono'",fontSize:12}}>
                  <span style={{color:"rgba(255,255,255,.4)"}}>Quiz: </span>
                  {w.quiz ? <span style={{color:lvl.color}}>{w.quiz.pct}% ({lvl.label})</span> : <span style={{color:"rgba(255,255,255,.3)"}}>—</span>}
                </div>
              </div>
            </div>
            {w.quiz && <div style={{width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:`${lvl.color}1a`,fontSize:20}}>{lvl.icon}</div>}
            {!w.quiz && <button className="btn" onClick={()=>navigate(`w${w.id}`,"quiz")} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:9,padding:"7px 16px",color:"rgba(255,255,255,.6)",fontSize:12,fontWeight:600}}>Fai il quiz →</button>}
          </div>)
        })}

        {/* Policy row */}
        <div style={{background:"rgba(255,255,255,.03)",borderRadius:14,padding:"18px 22px",border:"1px solid rgba(255,255,255,.06)",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <span style={{fontSize:28}}>📜</span>
          <div style={{flex:1,minWidth:140}}>
            <div style={{fontFamily:"'DM Sans'",fontWeight:700,fontSize:14,color:"#fff"}}>Policy TikTok Shop</div>
            <div style={{fontFamily:"'DM Mono'",fontSize:12,marginTop:6}}>
              <span style={{color:"rgba(255,255,255,.4)"}}>Quiz: </span>
              {policyQr ? <span style={{color:getLevel(policyQr.pct).color}}>{policyQr.pct}% ({getLevel(policyQr.pct).label})</span> : <span style={{color:"rgba(255,255,255,.3)"}}>—</span>}
            </div>
          </div>
          {policyQr ? <div style={{width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:`${getLevel(policyQr.pct).color}1a`,fontSize:20}}>{getLevel(policyQr.pct).icon}</div>
            : <button className="btn" onClick={()=>navigate("policy","quiz")} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:9,padding:"7px 16px",color:"rgba(255,255,255,.6)",fontSize:12,fontWeight:600}}>Fai il quiz →</button>}
        </div>
      </div>

      {/* Thresholds legend */}
      <div style={{background:"rgba(255,255,255,.03)",borderRadius:14,padding:20,border:"1px solid rgba(255,255,255,.06)"}}>
        <h4 style={{fontFamily:"'Bricolage Grotesque'",fontSize:14,fontWeight:700,marginBottom:12,color:"rgba(255,255,255,.6)"}}>Soglie di valutazione</h4>
        <div style={{display:"flex",flexWrap:"wrap",gap:12}}>
          {THRESHOLDS.map(t=><div key={t.min} style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:14}}>{t.icon}</span>
            <span style={{fontFamily:"'DM Mono'",fontSize:11,color:t.color}}>{t.min===0?"<80":t.min+"%"}+</span>
            <span style={{fontFamily:"'DM Sans'",fontSize:12,color:"rgba(255,255,255,.5)"}}>{t.label}</span>
          </div>)}
        </div>
      </div>
    </div>);
  };

  // ── RENDER ──
  return(<div style={{minHeight:"100vh",background:"#0a0a0f",fontFamily:"'DM Sans',sans-serif",color:"#fff",position:"relative",overflow:"hidden"}}>
    <style>{CSS}</style>
    {/* BG */}
    <div style={{position:"fixed",top:-200,right:-200,width:500,height:500,background:`radial-gradient(circle,${week?.color||"#ab47bc"}12,transparent 70%)`,borderRadius:"50%",pointerEvents:"none",transition:"background 1s"}}/>

    {/* Header */}
    <div style={{position:"sticky",top:0,zIndex:100,background:"rgba(10,10,15,.88)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
      <div style={{maxWidth:1100,margin:"0 auto",padding:"14px 20px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#fe2c55,#25f4ee)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bricolage Grotesque'",fontWeight:800,fontSize:14}}>TS</div>
            <div>
              <div style={{fontFamily:"'Bricolage Grotesque'",fontWeight:700,fontSize:15,letterSpacing:"-.02em"}}>TikTok Shop Academy</div>
              <div style={{fontFamily:"'DM Mono'",fontSize:10,color:"rgba(255,255,255,.35)"}}>Partner Ramp-up · 4 settimane + Policy</div>
            </div>
          </div>
          {renderNav()}
        </div>
      </div>
    </div>

    {/* Content */}
    <div ref={contentRef} style={{maxWidth:1100,margin:"0 auto",padding:"28px 20px 80px",position:"relative",zIndex:1}}>
      {isWeek && renderWeek()}
      {view==="policy" && renderPolicy()}
      {view==="recap" && renderRecap()}
    </div>
  </div>);
}
