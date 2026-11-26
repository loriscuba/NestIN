# NestIN

Piattaforma per la gestione di Asili Nido e Scuole Materne, divisa in due applicazioni.

| App | Per chi | Cartella | Porta |
| --- | --- | --- | --- |
| **NestIN** | Segreteria e maestre | `apps/nestin` | 5173 |
| **NestApp** | Genitori (mobile) | `apps/nestapp` | 5174 |
| `@nestin/shared` | Tipi, dati finti, tema grafico | `packages/shared` | – |

> **Stato: demo con dati finti.** Nessun database né backend: lo stato vive in memoria
> (ricaricando la pagina si riparte da zero). Le due app non sono ancora collegate tra loro.
> Cliente di riferimento per la demo: Asilo G.B. Vadone, Quiliano (SV).

## Avvio

```bash
npm install
npm run dev:nestin    # http://localhost:5173
npm run dev:nestapp   # http://localhost:5174
npm run build         # build di produzione di entrambe
npm run typecheck
```

## NestIN (maestre e segreteria)

Selettore "Accedi come" in alto a destra: **Segreteria** vede tutto, **Maestra** solo le schermate operative.

- Panoramica (sezioni Farm/Jungle/Ocean, giornata, da fare, menù)
- Presenze per sezione, Diario della giornata (maestre)
- Pasti (assenze → pasti da preparare, costi, diete, lista spesa) – solo segreteria
- Bambini (ricerca e scheda), Comunicazioni (invio a tutti o a una sezione)
- Rette e Economico – solo segreteria

## NestApp (genitori)

Oggi (presenza e diario), segnalazione assenza, Menù, Avvisi con azione (prenota, autorizza), Rette con pagamento simulato.
Gli avvisi sono filtrati per sezione del figlio.

## Struttura

```
packages/shared/src   data.ts (dati finti), types.ts, utils.ts, theme.css, BrandMark.tsx
apps/nestin/src       store.tsx (stato in memoria), App.tsx, pages/
apps/nestapp/src      store.tsx (stato in memoria), App.tsx, pages/
```

Quando arriverà il database, i `store.tsx` sono l'unico punto da sostituire con chiamate API
(es. Supabase) e `packages/shared/src/data.ts` diventa il seed.

## Logo

Il marchio nell'intestazione è provvisorio. Per usare il logo ufficiale della scuola copia il file in
`apps/nestin/public/logo-vadone.jpg` e `apps/nestapp/public/logo-vadone.jpg`, poi passa
`logoSrc="./logo-vadone.jpg"` a `<BrandMark />` in `App.tsx`.

## Identità grafica

Blu notte `#17305E`, giallo sole `#F4C430`, crema `#F8F4EC`; sezioni Farm ambra, Jungle verde, Ocean azzurro.
Titoli Baloo 2, testo Nunito Sans.
