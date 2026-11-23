# Mini Checkout + Browser Test Suite

A small single-page checkout (plain HTML/JavaScript, no backend) with automated browser tests written in Playwright (TypeScript), plus a test plan and recorded results.

## What the page does
- Two fixed-price products: Blue Notebook $12.50 and Steel Bottle $8.99
- Add items, remove items, change quantities; line totals and order total update (prices are stored in cents to avoid rounding errors)
- Required field: full name
- Blocks checkout for an empty cart or a blank/spaces-only name, with a clear message, and keeps what the customer entered
- On success shows "Order confirmed" with a reference (`ORD-...`), the name and the total
- A second click on Place Order cannot create a second order

## Requirements
- Node.js 18 or newer
- Git

## Setup
```bash
git clone https://github.com/<your-username>/mini-checkout-suite.git
cd mini-checkout-suite
npm install
npx playwright install chromium
```

## Run the app
```bash
npx http-server . -p 8080
```
Open http://127.0.0.1:8080. (Opening `index.html` directly in a browser also works.)

## Run the browser tests
```bash
npm test                 # headless; starts the web server automatically
npm run test:headed      # watch the tests in a visible browser
npx playwright test --ui # interactive mode with a step-by-step timeline
npm run report           # open the HTML report (screenshots and traces for failures)
```
Expected result: `5 passed`.

## Automated tests (`tests/checkout.spec.ts`)
| ID | Check |
|----|-------|
| TC1 | Successful checkout shows a confirmation with a reference, name and total |
| TC2 | Missing name blocks checkout, shows the message, keeps quantity and total |
| TC3 | Quantity change gives exact totals ($26.97 for 3 bottles, $39.47 with a notebook) |
| TC4 | Empty cart blocks checkout even with a name entered; the name is preserved |
| TC5 | Rapid clicks on Place Order create exactly one order |

How they are written:
- **Clean state:** every test loads a fresh page and first asserts the empty cart and `$0.00`.
- **Customer-visible assertions:** checks use Playwright's auto-retrying `expect` on visible text and values. There are no fixed waits.
- **Stable locators:** elements are found by `data-testid`.
- **Expected values are calculated by hand** from the price list, never copied from the app's output.
- **TC5 testing hook:** the confirmation carries a `data-orders-created` attribute so the test can check how many orders were actually created, not just whether a confirmation is visible.

## Manual tests
Empty cart (M1) and rapid double-click (M2), plus exploratory checks, are described in `TEST_PLAN.md`. Observations and screenshots are in `RESULTS.md` and `evidence/`.

## Known issues
Exploratory testing found two Low-severity defects in quantity input handling (typing `10` loses focus after the first digit; 0, negative or blank quantities leave the box and total out of sync). Steps and expected vs actual results are in `RESULTS.md` (DEF-1, DEF-2). The automated tests do not catch them, because Playwright's `fill()` sets a whole value at once.

## Project structure
```
index.html              checkout page
tests/checkout.spec.ts  automated tests
playwright.config.ts    Playwright config (starts the web server)
TEST_PLAN.md            risks and test cases
RESULTS.md              test results and defect log
evidence/               screenshots and raw test output
```

## Limitations
- Chromium only (no Firefox or Safari)
- The double-click protection is client-side, since there is no backend to enforce it
- No accessibility or performance testing