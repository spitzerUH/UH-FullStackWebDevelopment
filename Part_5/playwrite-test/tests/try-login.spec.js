const { test, expect, beforeEach, beforeAll, describe, afterEach } = require('@playwright/test')
const { loginWith, createDefaultUser, resetDatabase, frontendUrl } = require('./test-helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await resetDatabase({ request })
        await createDefaultUser({ request }, 'user', 'password')

        await page.goto(frontendUrl)
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.locator('form#login-form')).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'user', 'password')
            await expect(page.getByText('Logged in as Christoooooph')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'user', 'wrong')
            await expect(page.locator('text=Wrong credentials')).toBeVisible()
        })
    })
})

describe('When logged in', () => {
    beforeAll(async ({ request }) => {
        await resetDatabase({ request })
        await createDefaultUser({ request }, 'user', 'password')

    })

    beforeEach(async ({ page }) => {
        await page.goto(frontendUrl)
        await loginWith(page, 'user', 'password')
    })

    test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        const inputs = await page.locator('input[type="text"]')

        await inputs.nth(0).fill('My New Blog')
        await inputs.nth(1).fill('Mustermann')
        await inputs.nth(2).fill('http://localhost')
        await page.getByRole('button', { name: 'Create' }).click()

        await expect(page.locator('text=My New Blog Mustermann')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.locator('text=My New Blog Mustermann')).toBeVisible()


        await page.getByRole('button', { name: 'like' }).click()

        await expect(page.locator('text=likes: 1')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {

        await page.getByRole('button', { name: 'view' }).click()

        await expect(page.locator('text=My New Blog Mustermann')).toBeVisible()

        page.on('dialog', (dialog) => dialog.accept());

        await page.getByRole('button', { name: 'remove' }).click()


        await expect(page.locator('text=My New Blog Mustermann')).toHaveCount(0);

    });

    afterEach(async ({ page }) => {
        await page.getByRole('button', { name: 'Logout' }).click()
    })
})


describe('With two users', () => {
    beforeAll(async ({ request }) => {
        await resetDatabase({ request })
        await createDefaultUser({ request }, 'user', 'password')
        await createDefaultUser({ request }, 'user2', 'password2')

    })

    beforeEach(async ({ page }) => {
        await page.goto(frontendUrl)
    })

    test('can not see delete button of post created by another user', async ({ page }) => {
        await loginWith(page, 'user', 'password')
        await page.getByRole('button', { name: 'new blog' }).click()
        const inputs = await page.locator('input[type="text"]')

        await inputs.nth(0).fill('My New Blog')
        await inputs.nth(1).fill('Mustermann')
        await inputs.nth(2).fill('http://localhost')
        await page.getByRole('button', { name: 'Create' }).click()

        await expect(page.locator('text=My New Blog Mustermann')).toBeVisible()

        await page.getByRole('button', { name: 'Logout' }).click()
        await loginWith(page, 'user2', 'password2')
        await page.getByRole('button', { name: 'view' }).click()
        await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0);
    })
})



describe('check blog list order', () => {
    beforeAll(async ({ request }) => {
        await resetDatabase({ request })
        await createDefaultUser({ request }, 'user', 'password')
    })

    beforeEach(async ({ page }) => {
        await page.goto(frontendUrl)
    })

    test('blogs are ordered according to likes', async ({ page }) => {
        await loginWith(page, 'user', 'password')
        await page.getByRole('button', { name: 'new blog' }).click()
        let inputs = await page.locator('input[type="text"]')

        await inputs.nth(0).fill('First Blog')
        await inputs.nth(1).fill('Author1')
        await inputs.nth(2).fill('http://localhost/1')
        await page.getByRole('button', { name: 'Create' }).click()

        await page.getByRole('button', { name: 'new blog' }).click()
        inputs = await page.locator('input[type="text"]')

        await inputs.nth(0).fill('Second Blog')
        await inputs.nth(1).fill('Author2')
        await inputs.nth(2).fill('http://localhost/2')
        await page.getByRole('button', { name: 'Create' }).click()

        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'view' }).click()

        await page.getByRole('button', { name: 'like' }).nth(1).click()

        // await likeButtonSecondBlog.click()
        await page.waitForTimeout(100);

        const blogs = page.locator('.blog-list-entry')
        let firstBlog = await blogs.nth(0).textContent()
        let secondBlog = await blogs.nth(1).textContent()

        expect(firstBlog).toContain('Second Blog')
        expect(secondBlog).toContain('First Blog')
    })
})