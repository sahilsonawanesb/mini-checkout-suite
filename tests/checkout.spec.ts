import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('empty-cart')).toBeVisible();
  await expect(page.getByTestId('order-total')).toHaveText('$0.00');
});

test('TC1: successful checkout shows a confirmation with a reference', async ({ page }) => {
  await page.getByTestId('add-notebook').click();
  await expect(page.getByTestId('line-notebook')).toHaveText('$12.50');

  await page.getByTestId('name').fill('Asha Rao');
  await page.getByTestId('place-order').click();

  await expect(page.getByTestId('confirmation')).toBeVisible();
  await expect(page.getByTestId('confirmation')).toContainText('Order confirmed');
  await expect(page.getByTestId('conf-ref')).toHaveText(/^ORD-[A-Z0-9]+$/);
  await expect(page.getByTestId('conf-name')).toHaveText('Asha Rao');
  await expect(page.getByTestId('conf-total')).toHaveText('$12.50');
});

test('TC2: missing name blocks checkout and keeps the cart', async ({ page }) => {
  await page.getByTestId('add-bottle').click();
  await page.getByTestId('place-order').click();

  await expect(page.getByTestId('error')).toHaveText('Please enter your full name.');
  await expect(page.getByTestId('confirmation')).toBeHidden();
  await expect(page.getByTestId('qty-bottle')).toHaveValue('1');   // data preserved
  await expect(page.getByTestId('order-total')).toHaveText('$8.99');
});

test('TC3: quantity change updates line and order totals exactly', async ({ page }) => {
  await page.getByTestId('add-notebook').click();
  await page.getByTestId('add-bottle').click();
  await expect(page.getByTestId('order-total')).toHaveText('$21.49');

  await page.getByTestId('qty-bottle').fill('3');
  await expect(page.getByTestId('line-bottle')).toHaveText('$26.97');
  await expect(page.getByTestId('order-total')).toHaveText('$39.47');
});


test('TC4: empty cart blocks checkout even with a name entered', async ({ page }) => {
  await page.getByTestId('name').fill('Asha Rao');
  await page.getByTestId('place-order').click();

  await expect(page.getByTestId('error')).toContainText('Your cart is empty');
  await expect(page.getByTestId('confirmation')).toBeHidden();
  await expect(page.getByTestId('name')).toHaveValue('Asha Rao');   // input preserved
  await expect(page.getByTestId('order-total')).toHaveText('$0.00');
});

test('TC5: double-click gives exactly one confirmation', async ({ page }) => {
  await page.getByTestId('add-notebook').click();
  await page.getByTestId('name').fill('Asha Rao');
  await page.getByTestId('place-order').dblclick();

  await expect(page.getByTestId('confirmation')).toHaveCount(1);
  await expect(page.getByTestId('confirmation')).toContainText('Order confirmed');
});