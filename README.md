# ebSerialDate

Eine kleine TypeScript-Bibliothek für Datumsrechnung mit Tageszahlen, wie sie Tabellenkalkulationen verwenden.
Der 1. Januar 1900 hat die Nummer 2, der 31. Dezember 9999 die Nummer 2958465.

Sie ist eine Neuumsetzung der Klasse `SerialDate` aus der Bibliothek JCommon (David Gilbert), die Robert C. Martin
in *Clean Code*, Kapitel 16 „Refactoring SerialDate“ als Fallstudie verwendet.

## Grundidee

**Ein Datum ist einfach seine Tageszahl.** Es gibt keine Klassen und keine Objekte, nur Funktionen auf Zahlen.
Vergleichen, Sortieren und Speichern funktionieren damit ohne weiteres. Geschrieben ist die Bibliothek in TypeScript,
und der Compiler unterscheidet ein Datum (`SerialDate`) von einer gewöhnlichen Zahl, ohne dass dafür zur Laufzeit etwas
anderes als die Zahl existiert.

```ts
import { calcOrdinal, addMonths, ordinalToString, isBefore, MONTHS } from './src/serial-date'

const d = calcOrdinal                                   // d(tag, monat, jahr) -> Tageszahl
const ende = addMonths(1, d(31, MONTHS.JANUARY, 1900))  // 28. Februar 1900, Tag wird gekappt
ordinalToString(ende)                                   // '28-February-1900'
isBefore(d(1, MONTHS.JANUARY, 1900), ende)              // true
```

## Funktionen

| Gruppe | Funktionen |
|---|---|
| Erzeugen | `calcOrdinal(tag, monat, jahr)`, `createInstance(tageszahl \| Date)` |
| Zerlegen | `ordinalToYear`, `ordinalToMonth`, `ordinalToDayOfMonth`, `ordinalToWeekday`, `toDate`, `ordinalToString` |
| Rechnen | `addDays`, `addMonths`, `addYears`, `getEndOfCurrentMonth` |
| Wochentage | `getPreviousDayOfWeek`, `getFollowingDayOfWeek`, `getNearestDayOfWeek` |
| Vergleichen | `compare`, `isOn`, `isBefore`, `isOnOrBefore`, `isAfter`, `isOnOrAfter`, `isInRange` |
| Kalender | `isLeapYear`, `leapYearCount`, `lastDayOfMonth` |
| Codes und Namen | `isValidWeekdayCode`, `isValidMonthCode`, `isValidWeekInMonthCode`, `stringToWeekdayCode`, `stringToMonthCode`, `weekdayCodeToString`, `monthCodeToString`, `monthCodeToShortString`, `monthCodeToQuarter`, `getMonths`, `weekInMonthToString`, `relativeToString` |
| Konstanten | `DAYS`, `MONTHS`, `WEEKCODES`, `RELATIVE`, `DATE_INTERVAL`, die Namenslisten `days`, `days2`, `months`, `months2`, `SERIAL_LOWER_BOUND`, `SERIAL_UPPER_BOUND`, `MINIMUM_YEAR_SUPPORTED`, `MAXIMUM_YEAR_SUPPORTED` |

Wochentage laufen von `MONDAY = 1` bis `SUNDAY = 7`, Monate von `JANUARY = 1` bis `DECEMBER = 12`.
`isInRange(datum, d1, d2, intervall)` kennt die Intervalle `OPEN`, `CLOSED_LEFT`, `CLOSED_RIGHT` und `CLOSED`
(Standard). Die Grenzen dürfen vertauscht sein.

## Typen

| Typ | Bedeutung |
|---|---|
| `SerialDate` | eine Tageszahl, nur im Compiler von `number` unterschieden |
| `Month` | 1 bis 12, die Werte von `MONTHS` |
| `Weekday` | 1 bis 7, die Werte von `DAYS` |
| `WeekInMonth`, `Relative`, `DateInterval` | die Werte von `WEEKCODES`, `RELATIVE` und `DATE_INTERVAL` |

Damit lehnt der Compiler typische Verwechslungen ab:

```ts
const date = calcOrdinal(1, MONTHS.JANUARY, 2006)
addDays(5, date)          // ok
addDays(date, 5)          // Fehler: Argumente vertauscht
addDays(5, 3)             // Fehler: eine Zahl ist kein Datum
calcOrdinal(1, 2006, 12)  // Fehler: 2006 ist kein Month
```

Die Prüfungen zur Laufzeit bleiben trotzdem, denn JavaScript-Aufrufer sehen die Typen nicht. Ein Datum kommt aus
`calcOrdinal` oder `createInstance`; wer eine Zahl aus anderer Quelle hat, macht sie mit `createInstance(zahl)` zum
`SerialDate`, und das prüft dabei den Bereich.

Ungültige Werte werfen einen Fehler: ein Tag, den es im Monat nicht gibt, ein Jahr außerhalb von 1900–9999,
ein ungültiger Monats- oder Wochentagscode und jedes Ergebnis einer Rechnung außerhalb des Bereichs.

## Tests

```
npm install
npm test          # Tests
npm run typecheck # Typprüfung mit tsc
```

Die Tests übernehmen die Fälle der Originaltests und ergänzen sie, zum Beispiel um Schaltjahre und die Bereichsgrenzen.
Aufrufe mit absichtlich ungültigen Codes tragen ein `@ts-expect-error`: Der Compiler lehnt sie ab, und der Test prüft,
dass zur Laufzeit trotzdem ein Fehler geworfen wird.

## Was bewusst fehlt

- **`getDescription` / `setDescription`:** Ein frei wählbarer Text pro Datum hat mit Datumsrechnung nichts zu tun.
  Wer Texte zu Daten braucht, führt eine eigene Zuordnung, zum Beispiel `{ [d(25, 12, 2006)]: 'Weihnachten' }`.
- **Lokalisierung:** Die Namen der Monate und Wochentage sind fest englisch. Das Ergebnis darf nicht davon abhängen,
  auf welchem Rechner der Code läuft. Eine Anzeige in der Landessprache gehört in die Darstellung, etwa mit
  `Intl.DateTimeFormat` auf dem Ergebnis von `toDate`.
- **Austauschbare Datumsarten:** Es gibt eine Darstellung und keine Basisklasse oder Factory.

## Gedanken zum Original und zu Martins Überarbeitung

Diese Neuumsetzung ist in TypeScript geschrieben, weil ich mit JavaScript und TypeScript besser vertraut bin. Die
grundlegende Lösung ließe sich jedoch nahezu genauso in Java umsetzen. Der Vergleich soll daher keine Überlegenheit
einer Sprache zeigen. Er richtet sich gegen den Entwurf von Martins Überarbeitung: Für diese konkrete Aufgabe erzeugen
Klassenhierarchie und Factories viel Komplexität, ohne einen entsprechenden Nutzen zu bieten.

Beim Nachbauen sind zwei Dinge aufgefallen.

**Die Lösung kommt mit sehr wenig Code aus.** Ohne Kommentare und Leerzeilen hat `src/serial-date.ts` rund 156 Zeilen.
Zum Vergleich (grob gezählt):

| Fassung | Zeilen gesamt | davon Code |
|---|---|---|
| Original (`SerialDate` + `SpreadsheetDate`) | ca. 1500 | ca. 550 |
| Martins Überarbeitung (11 Dateien) | ca. 800 | ca. 505 |
| diese Bibliothek (TypeScript) | 192 | 156 |

Die Zahlen des Originals stammen aus den Quelltext-Listings von
[SerialDate](https://www.jfree.org/jcommon/api/src-html/org/jfree/date/SerialDate.html) und
[SpreadsheetDate](https://www.jfree.org/jcommon/api/src-html/org/jfree/date/SpreadsheetDate.html), die Aufteilung in
Code und Kommentare ist geschätzt. Martins Fassung wurde aus einer
[Abschrift auf GitHub](https://github.com/ludwiggj/CleanCode/tree/master/src/clean/code/chapter16/solution)
gezählt, nicht aus dem Buch selbst. Die Tests sind nirgends mitgezählt.

**Beide Java-Fassungen sind für diese Aufgabe aufgebläht.** Das liegt am Entwurf und nicht an der Sprache:

- Eine abstrakte Klasse mit genau einer Unterklasse, dazu zwei Factories, soll austauschbare Datumsarten
  ermöglichen. Eine sinnvolle zweite Art gibt es nicht. Selbst Excels zweites Datumssystem (Start 1904) ließe sich
  mit einer Konstanten abdecken.
- Martin verbessert Benennung, Zuständigkeiten und Struktur, behebt Fehler und sichert die Änderungen durch Tests ab.
  Die grundlegende Architektur stellt er dabei jedoch nicht infrage. Dadurch wird der Code verständlicher, aber kaum
  kleiner.
- Das objektorientierte Grundmodell mit Klassenhierarchie und Factories stellt er nicht infrage. TypeScript erlaubt
  hier eine wesentlich direktere Lösung; auch ein eigener Datumstyp würde daran wenig ändern.
- Die Lokalisierung kostet in Java nur wenige Zeilen (`DateFormatSymbols`), sie macht aber das Verhalten und die
  Tests vom Rechner abhängig.

Martin kritisiert den Code des Originals gründlich. Sein eigenes Ergebnis ist aber alles andere als optimal, und das
erwartet man von einem Lehrbuch, das fremden Code zerlegt: Die Klassenhierarchie samt Factories bleibt, und der Code ist
kaum kürzer geworden. Als Übung im kleinschrittigen Refaktorieren mit Tests ist das Kapitel trotzdem brauchbar.

Wer heute in Java rechnet, nimmt ohnehin `java.time.LocalDate`.

## Lizenz

Apache License 2.0, siehe [LICENSE](LICENSE).
