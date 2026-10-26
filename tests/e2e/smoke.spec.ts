import { test, expect } from "@playwright/test";

test.describe("Converter Smoke Test Suite", () => {
  test("performs full live conversion, swap, copy, validation error, and theme toggle", async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions for copy test
    await context.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});

    // 1. Visit /hex-to-decimal
    await page.goto("/hex-to-decimal");
    await expect(page).toHaveTitle(/Hex to Decimal/);

    // Verify H1 is present
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();

    const input = page.locator("#converter-input");
    const output = page.locator("#converter-output");

    // 2. Clear input and type "7DE", verify "2014" appears
    await input.fill("");
    await input.fill("7DE");
    await expect(output).toContainText("2014");

    // 3. Swap works: click swap button
    const swapButton = page.locator('button[aria-label="Swap conversion direction"]').first();
    await swapButton.click();

    // After swapping, input should have "2014" and output should have "7DE"
    await expect(input).toHaveValue("2014");
    await expect(output).toContainText("7DE");

    // Swap back
    await swapButton.click();
    await expect(input).toHaveValue("7DE");
    await expect(output).toContainText("2014");

    // 4. Copy works
    const copyButton = page.locator('button[aria-label*="Copy"]').first();
    await copyButton.click();
    await expect(page.locator("text=Copied!")).toBeVisible();

    // 5. Invalid character shows inline error
    await input.fill("7DEG");
    const errorAlert = page.locator("#converter-error");
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText("G is not a valid hexadecimal digit");

    // 6. Dark/Light theme toggle works
    const html = page.locator("html");
    const themeButton = page.locator('button[title="Toggle color theme"]');

    // Check initial dark theme
    await expect(html).toHaveAttribute("data-theme", "dark");

    // Click toggle to switch to light
    await themeButton.click();
    await expect(html).toHaveAttribute("data-theme", "light");

    // Click toggle back to dark
    await themeButton.click();
    await expect(html).toHaveAttribute("data-theme", "dark");
  });
});
