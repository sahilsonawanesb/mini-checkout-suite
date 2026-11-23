# Test Plan: Mini Checkout

## 1. Scope
**In scope:** cart (add/remove/quantity), totals, validation, order confirmation.
**Out of scope:** payments, backend, performance, accessibility audit.
**Browser:** Chromium via Playwright.
**Approach:** automated browser tests for 3 key checks, manual tests for 2 scenarios.

## 2. Risks (highest priority first)
_
What if the customer clicks Place Order twice?
What if the cart is empty?
What if the name is blank, or just spaces?
What if the error message wipes what they typed?
What if they enter quantity 0, -1, or 1000?
What if there's no confirmation reference after success?_

## 2. Risks (highest priority first)

| # | Risk | Why it matters | Impact | Likelihood | Covered by |
|---|------|----------------|--------|-----------|------------|
| 1 | Order total is wrong, or doesn't update after a quantity change or removal | Customer is charged the wrong amount; trust lost | High | Medium | TC3 |
| 2 | Clicking Place Order twice creates two confirmations/orders | Customer could be charged twice | High | Medium | M2 (+ optional automated) |
| 3 | Order is accepted with an empty cart | An empty or meaningless order is created | High | Medium | M1 |
| 4 | Order is accepted with a blank or spaces-only name | Order has no customer identity; can't be fulfilled | High | Medium | TC2 |
| 5 | No confirmation or reference after a successful order | Customer doesn't know the order went through, may retry and duplicate it | High | Low | TC1 |
| 6 | Validation error wipes what the customer entered | Customer must start over and may abandon the purchase | Medium | Medium | TC2 (checks data is kept) |
| 7 | Odd quantity values (0, negative, decimal, 1000) are accepted | Negative totals or absurd orders | Medium | High | Manual exploratory (M3) |



### TC2: Missing name blocks checkout
**Type:** Automated  |  **Risk:** #4
**Preconditions:** fresh page, empty cart
**Steps:**
1. Click "Add to cart" on Steel Bottle
2. Leave the name field empty
3. Click "Place Order"

**Expected:**
- Error "Please enter your full name." is visible
- No confirmation appears
- Cart still shows 1 Steel Bottle, total $8.99

## 4. Test data
| Item | Price |
|------|-------|
| Blue Notebook | $12.50 |
| Steel Bottle | $8.99 |
| Valid name | "Asha Rao" |
| Invalid names | "" and "   " (spaces only) |

## 5. Evidence
- Screenshots saved in `evidence/` named `M1-empty-cart.png` and `M2-double-click.png`
- Results written in RESULTS.md: what I did, what I saw, pass/fail
- Any defect: steps, expected vs actual, screenshot