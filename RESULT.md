# Test Results: Mini Checkout

**Date:** 2026-11-23
**Tester:** [your name]
**Browser:** Chromium (headless) via Playwright 1.63.0 [replace with `npx playwright --version` on your machine]
**Build tested:** commit [run `git log -1 --format=%h`]

## 1. Summary
- Automated: 5 of 5 passed
- Manual: M1 and M2 [fill in after you run them], plus exploratory checks
- Defects found: 2 (both Low severity, in quantity input handling)

## 2. Automated results
Command: `npm test`  |  Raw output: `evidence/test-run-output.txt` [save with `npm test > evidence/test-run-output.txt`]

| ID | Check | Result |
|----|-------|--------|
| TC1 | Successful checkout shows confirmation with reference | Pass |
| TC2 | Missing name blocks checkout, cart preserved | Pass |
| TC3 | Quantity change gives exact totals ($26.97, $39.47) | Pass |
| TC4 | Empty cart blocked even with a name | Pass |
| TC5 | Rapid clicks create exactly one order | Pass |

### Do the tests catch real problems? (break-it-on-purpose check)
| What I broke | Expected | What happened |
|--------------|----------|---------------|
| Bottle price 899 -> 900 | TC2, TC3 fail | TC2 and TC3 failed, 3 passed |
| Name check disabled | TC2 fails | TC2 failed, 4 passed |
| Both double-click guards removed | TC5 fails | TC5 failed (order count was not 1), 4 passed |

Note: removing only `if (orderPlaced) return;` did not fail TC5, because the disabled button also blocks extra clicks. Both guards had to be removed. All changes were reverted afterwards and the suite passed again.

## 3. Manual results

### M1: Empty cart
- **Did:** typed a name, clicked Place Order with an empty cart
- **Expected:** blocked, message shown, no confirmation, name preserved
- **Actual:** [what you saw]
- **Result:** [Pass/Fail]
- **Evidence:** evidence/M1-empty-cart.png

### M2: Rapid double-click
- **Did:** added a Notebook, entered a name, clicked Place Order rapidly [n] times over [n] attempts
- **Expected:** exactly one confirmation and one reference
- **Actual:** [what you saw, including whether a second click was even possible]
- **Result:** [Pass/Fail]
- **Evidence:** evidence/M2-double-click.png

### Exploratory checks
| Check | What I did | What I saw |
|-------|-----------|------------|
| Quantity 0 | Entered 0 for Steel Bottle | Box shows 0, total stays $8.99 (see DEF-2) |
| Quantity -5 | Entered -5 | Box shows -5, total stays $8.99 (see DEF-2) |
| Quantity 100 | Entered 100 | Capped at 99, line total $890.01 |
| Quantity blank | Cleared the box | Box empty, total unchanged (see DEF-2) |
| Name `<b>x</b>` | Placed an order with that name | Shown as plain text, no HTML element created |
| Typing `10` by keyboard | Typed 1 then 0, 100 ms apart | Box ended as 1 (see DEF-1) |

## 4. Defects

### DEF-1: Quantity box loses focus after each keystroke
- **Severity:** Low
- **Steps:** 1. Click Add to cart on Steel Bottle. 2. Click in the quantity box and select its contents. 3. Type `10` with the keyboard.
- **Expected:** box shows 10, total $89.90
- **Actual:** box shows 1, total $8.99. The cart row is rebuilt on every keystroke, so the cursor leaves the box after the first digit.
- **Why tests missed it:** Playwright's `fill()` sets the whole value in one step.
- **Evidence:** [screenshot: evidence/DEF-1.png]
- **Status:** Open

### DEF-2: Invalid or blank quantity leaves the box and total out of sync
- **Severity:** Low
- **Steps:** 1. Add Steel Bottle. 2. Change the quantity to 0 (or -5, or clear it).
- **Expected:** value rejected or corrected, and box and total agree
- **Actual:** box shows 0 / -5 / blank while the total still shows $8.99
- **Evidence:** [screenshot: evidence/DEF-2.png]
- **Status:** Open

## 5. Limitations
- Chromium only; no Firefox or Safari
- Double-click protection is client-side, because there is no backend
- No accessibility or performance testing